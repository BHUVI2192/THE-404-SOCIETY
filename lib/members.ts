import { doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { supabase } from "./supabase";

export interface MemberRecord {
  id?: string;
  memberId: string;
  name: string;
  email: string;
  contact?: string | null;
  college?: string | null;
  year?: string | null;
  interest?: string | null;
  skills?: string | null;
  linkedin?: string | null;
  social?: string | null;
  reason?: string | null;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
  metadata?: Record<string, any>;
  createdAt?: string | number;
  updatedAt?: string | number;
}

const FIRESTORE_MEMBERS_COLLECTION = "nexus_members";

/**
 * Persists an approved member into BOTH Supabase ('members') and Firestore ('nexus_members')
 * Guaranteed storage for project access, verification, and collaboration platforms.
 */
export async function saveApprovedMember(data: {
  memberId: string;
  name: string;
  email: string;
  contact?: string | null;
  college?: string | null;
  year?: string | null;
  interest?: string | null;
  skills?: string | null;
  social?: string | null;
  linkedin?: string | null;
  reason?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const email = data.email.trim().toLowerCase();
    const memberId = data.memberId.trim().toUpperCase();
    const linkedin = data.linkedin || (data.social && data.social.includes('linkedin') ? data.social : data.social || null);
    const nowIso = new Date().toISOString();
    const nowMs = Date.now();

    // 1. Store in Supabase 'members' table (upsert on email or member_id)
    try {
      const { error: sbError } = await supabase
        .from('members')
        .upsert(
          {
            member_id: memberId,
            name: data.name,
            email: email,
            contact: data.contact || null,
            college: data.college || null,
            year: data.year || null,
            interest: data.interest || null,
            skills: data.skills || null,
            linkedin: linkedin,
            social: data.social || null,
            reason: data.reason || null,
            role: 'member',
            status: 'active',
            updated_at: nowIso,
          },
          { onConflict: 'email' }
        );

      if (sbError) {
        console.warn('[Members] Supabase upsert error:', sbError);
      }
    } catch (sbErr) {
      console.warn('[Members] Supabase failed to save member:', sbErr);
    }

    // 2. Also update 'onboarding_applications' in Supabase if an application exists
    try {
      await supabase
        .from('onboarding_applications')
        .update({
          status: 'approved',
          member_id: memberId,
          updated_at: nowIso,
        })
        .ilike('email', email);
    } catch (appErr) {
      console.warn('[Members] Supabase onboarding status update warning:', appErr);
    }

    // 3. Store in Firestore 'nexus_members' with document ID = memberId
    try {
      const memberDocRef = doc(db, FIRESTORE_MEMBERS_COLLECTION, memberId);
      await setDoc(
        memberDocRef,
        {
          memberId,
          name: data.name,
          email,
          contact: data.contact || null,
          college: data.college || null,
          year: data.year || null,
          interest: data.interest || null,
          skills: data.skills || null,
          linkedin,
          social: data.social || null,
          reason: data.reason || null,
          role: 'member',
          status: 'active',
          updatedAt: nowMs,
          createdAt: nowMs,
        },
        { merge: true }
      );
    } catch (fsErr) {
      console.warn('[Members] Firestore member doc error:', fsErr);
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Members] Failed to save approved member:', err);
    return { success: false, error: err?.message || 'Failed to save approved member' };
  }
}

/**
 * Lookup member by Member ID (e.g., 404-2026-001) for future project collaboration tools
 */
export async function getMemberById(memberId: string): Promise<MemberRecord | null> {
  const cleanId = memberId.trim().toUpperCase();

  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('member_id', cleanId)
      .eq('status', 'active')
      .single();

    if (!error && data) {
      return {
        id: data.id,
        memberId: data.member_id,
        name: data.name,
        email: data.email,
        contact: data.contact,
        college: data.college,
        year: data.year,
        interest: data.interest,
        skills: data.skills,
        linkedin: data.linkedin,
        social: data.social,
        reason: data.reason,
        role: data.role,
        status: data.status,
        createdAt: data.created_at,
      };
    }
  } catch {
    // fallback
  }

  // Fallback to Firestore
  try {
    const memberDoc = await getDoc(doc(db, FIRESTORE_MEMBERS_COLLECTION, cleanId));
    if (memberDoc.exists()) {
      return memberDoc.data() as MemberRecord;
    }
  } catch {
    // fallback
  }

  return null;
}

