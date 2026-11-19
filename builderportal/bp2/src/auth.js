/**
 * Authentication and Member Directory for Builder Portal.
 * Members are approved through the main website onboarding process.
 * Unique Member IDs are issued to their email upon acceptance and stored in the database.
 * Common access password: builder404
 */

export const COMMON_PASSWORD = 'builder404';

// Verified Active Core Members with unique, non-pattern cryptographic identifiers
export const DEFAULT_MEMBERS = [
  { id: '404-9F82', name: 'Bhuvan N', role: 'Founder & President' },
  { id: '404-3D71', name: 'K Hrishikesh', role: 'Co-Founder & Vice President' },
  { id: '404-8E43', name: 'K Deepak', role: 'CTO' },
  { id: '404-5A19', name: 'Rudresh J', role: 'CCO' },
  { id: '404-4C62', name: 'Pramath H', role: 'CINO' },
  { id: '404-7B90', name: 'Yashwardhan Kumar', role: 'COO' },
];

const STORAGE_SESSION = 'builderportal:session';
const STORAGE_CACHED_MEMBERS = 'builderportal:synced_members';

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://ccteuughftetfjpvrjtb.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdGV1dWdoZnRldGZqcHZyanRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MjU1NTYsImV4cCI6MjEwNDIwMTU1Nn0.IKE9hWJpaa-neqRVljSoXglY7Ltw-XxsCPFRdwW6nvQ';

/**
 * Returns all currently known members (core roster + cached database members).
 */
export function getMembers() {
  try {
    const cached = JSON.parse(localStorage.getItem(STORAGE_CACHED_MEMBERS) || '[]');
    const map = new Map();
    DEFAULT_MEMBERS.forEach((m) => map.set(m.id.toUpperCase(), m));
    cached.forEach((m) => map.set(m.id.toUpperCase(), m));
    return Array.from(map.values());
  } catch {
    return DEFAULT_MEMBERS;
  }
}

/**
 * Looks up a member by unique Member ID.
 * Checks local core roster first, then cached members, then queries Supabase members table.
 */
export async function findMember(memberId) {
  const raw = String(memberId || '').trim().toUpperCase();
  if (!raw) return null;

  // Support both "404-XXXX" and "XXXX" input
  const fullId = raw.startsWith('404-') ? raw : `404-${raw}`;
  const candidates = [fullId, raw];

  // 1. Check local core & cached members
  const localList = getMembers();
  const match = localList.find((m) => candidates.includes(m.id.toUpperCase()));
  if (match) return match;

  // 2. Query Supabase database for approved member
  try {
    const query = `or=(member_id.ilike.${encodeURIComponent(fullId)},member_id.ilike.${encodeURIComponent(raw)})`;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/members?${query}&select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0];
        const dbMember = {
          id: row.member_id,
          name: row.name,
          role: row.interest || row.college || 'Builder',
        };

        // Cache for offline/future sessions
        try {
          const cached = JSON.parse(localStorage.getItem(STORAGE_CACHED_MEMBERS) || '[]');
          cached.push(dbMember);
          localStorage.setItem(STORAGE_CACHED_MEMBERS, JSON.stringify(cached));
        } catch { /* storage full / unavailable */ }

        return dbMember;
      }
    }

    // 3. Fallback check: onboarding_applications table with status=approved
    const appQuery = `status=eq.approved&or=(member_id.ilike.${encodeURIComponent(fullId)},member_id.ilike.${encodeURIComponent(raw)})`;
    const appRes = await fetch(`${SUPABASE_URL}/rest/v1/onboarding_applications?${appQuery}&select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (appRes.ok) {
      const appRows = await appRes.json();
      if (Array.isArray(appRows) && appRows.length > 0) {
        const row = appRows[0];
        const appMember = {
          id: row.member_id,
          name: row.name,
          role: row.interest || row.college || 'Builder',
        };

        try {
          const cached = JSON.parse(localStorage.getItem(STORAGE_CACHED_MEMBERS) || '[]');
          cached.push(appMember);
          localStorage.setItem(STORAGE_CACHED_MEMBERS, JSON.stringify(cached));
        } catch { /* storage full / unavailable */ }

        return appMember;
      }
    }
  } catch (err) {
    console.warn('Database member lookup unavailable:', err);
  }

  return null;
}

export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function login(memberId, password) {
  const cleanId = String(memberId || '').trim().toUpperCase();
  const cleanPass = String(password || '').trim();

  if (!cleanId) {
    throw new Error('Please enter your Member ID');
  }

  if (cleanPass !== COMMON_PASSWORD) {
    throw new Error('Incorrect password. Common access key: ' + COMMON_PASSWORD);
  }

  const member = await findMember(cleanId);
  if (!member) {
    throw new Error(
      `Member ID "${cleanId}" not found. Please enter the unique Member ID sent to your email upon community acceptance.`
    );
  }

  const session = {
    id: member.id,
    name: member.name,
    role: member.role,
    loggedInAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_SESSION, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent('authchange', { detail: session }));
  return session;
}

export function logout() {
  localStorage.removeItem(STORAGE_SESSION);
  window.dispatchEvent(new CustomEvent('authchange', { detail: null }));
  location.hash = '#/login';
}
