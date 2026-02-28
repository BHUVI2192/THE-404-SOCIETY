import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

interface MemberIDCounter {
  year: number;
  counter: number;
  lastId: string;
}

const COUNTER_COLLECTION = "nexus_member_id_counters";

// Get current year counter
export const getYearCounter = async (year: number): Promise<number> => {
  try {
    const docRef = doc(db, COUNTER_COLLECTION, String(year));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().counter as number;
    }
    return 0;
  } catch (error) {
    console.error("Error getting year counter:", error);
    return 0;
  }
};

// Generate next member ID for a given year
export const generateMemberId = async (year: number = new Date().getFullYear()): Promise<string> => {
  try {
    const docRef = doc(db, COUNTER_COLLECTION, String(year));
    const docSnap = await getDoc(docRef);

    let counter = 0;
    if (docSnap.exists()) {
      counter = docSnap.data().counter;
    }

    counter++;
    const paddedNumber = String(counter).padStart(3, '0');
    const memberId = `404-${year}-${paddedNumber}`;

    await setDoc(docRef, { year, counter, lastId: memberId });

    return memberId;
  } catch (error) {
    console.error("Error generating member ID:", error);
    return `404-${year}-ERROR`;
  }
};

// Manually set a member ID (for overrides)
export const setMemberId = async (memberId: string): Promise<boolean> => {
  try {
    const match = memberId.match(/^404-(\d{4})-(\d{3})$/);
    if (!match) return false;

    const year = parseInt(match[1]);
    const number = parseInt(match[2]);

    const docRef = doc(db, COUNTER_COLLECTION, String(year));
    const docSnap = await getDoc(docRef);

    let currentCounter = 0;
    if (docSnap.exists()) {
      currentCounter = docSnap.data().counter;
    }

    if (number >= currentCounter) {
      await setDoc(docRef, { year, counter: number, lastId: memberId });
    }

    return true;
  } catch (error) {
    console.error("Error setting member ID:", error);
    return false;
  }
};

// Search for member by ID (utility)
export const validateMemberId = (memberId: string): boolean => {
  return /^404-\d{4}-\d{3}$/.test(memberId);
};
