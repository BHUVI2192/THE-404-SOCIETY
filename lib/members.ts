/**
 * lib/members.ts
 * Member registry — stores approved community members for use
 * in the future project collaboration app.
 */

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

const MEMBERS_COLLECTION = 'members';

export interface Member {
  id?: string;          // Firestore doc ID
  memberId: string;     // 404-YYYY-NNN format
  name: string;
  email: string;
  social?: string | null;   // LinkedIn / portfolio URL
  college?: string;
  year?: string;
  interest?: string;
  approvedAt: number;   // Unix timestamp ms
  communityAppId?: string; // Reference back to nexus_community_applications doc
}

/**
 * Save an approved member to the members registry.
 * Called by CommunityManagement after approval.
 */
export async function saveMember(member: Omit<Member, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, MEMBERS_COLLECTION), member);
  console.log(`[members] Saved member ${member.memberId} → Firestore id: ${docRef.id}`);
  return docRef.id;
}

/**
 * Get all members, ordered by approval date (newest first).
 */
export async function getMembers(): Promise<Member[]> {
  const snap: QuerySnapshot<DocumentData> = await getDocs(
    query(collection(db, MEMBERS_COLLECTION), orderBy('approvedAt', 'desc'))
  );
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
}

/**
 * Find a member by their member ID (404-YYYY-NNN).
 */
export async function getMemberByMemberId(memberId: string): Promise<Member | null> {
  const snap = await getDocs(
    query(collection(db, MEMBERS_COLLECTION), where('memberId', '==', memberId), limit(1))
  );
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Member;
}

/**
 * Find a member by their email address.
 */
export async function getMemberByEmail(email: string): Promise<Member | null> {
  const snap = await getDocs(
    query(collection(db, MEMBERS_COLLECTION), where('email', '==', email), limit(1))
  );
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Member;
}
