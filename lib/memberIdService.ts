import { db } from "./firebase";

interface MemberIDCounter {
  year: number;
  counter: number;
  lastId: string;
}

const MEMBER_ID_COUNTER_KEY = "member_id_counters";

// Get current year counter
export const getYearCounter = async (year: number): Promise<number> => {
  const counters: MemberIDCounter[] = db.get(MEMBER_ID_COUNTER_KEY) || [];
  const yearCounter = counters.find((c) => c.year === year);
  return yearCounter ? yearCounter.counter : 0;
};

// Generate next member ID for a given year
export const generateMemberId = async (year: number = new Date().getFullYear()): Promise<string> => {
  const counters: MemberIDCounter[] = db.get(MEMBER_ID_COUNTER_KEY) || [];
  
  // Find or create year counter
  let yearCounter = counters.find((c) => c.year === year);
  
  if (!yearCounter) {
    yearCounter = { year, counter: 0, lastId: '' };
    counters.push(yearCounter);
  }

  // Increment counter
  yearCounter.counter++;
  const paddedNumber = String(yearCounter.counter).padStart(3, '0');
  const memberId = `404-${year}-${paddedNumber}`;
  yearCounter.lastId = memberId;

  // Save updated counters
  db.set(MEMBER_ID_COUNTER_KEY, counters);

  return memberId;
};

// Manually set a member ID (for overrides)
export const setMemberId = async (memberId: string): Promise<boolean> => {
  // Validate format: 404-YYYY-NNN
  const match = memberId.match(/^404-(\d{4})-(\d{3})$/);
  if (!match) return false;

  const year = parseInt(match[1]);
  const number = parseInt(match[2]);
  
  const counters: MemberIDCounter[] = db.get(MEMBER_ID_COUNTER_KEY) || [];
  let yearCounter = counters.find((c) => c.year === year);
  
  if (!yearCounter) {
    yearCounter = { year, counter: 0, lastId: '' };
    counters.push(yearCounter);
  }

  // Update counter to at least the provided number
  if (number >= yearCounter.counter) {
    yearCounter.counter = number;
    yearCounter.lastId = memberId;
    db.set(MEMBER_ID_COUNTER_KEY, counters);
  }

  return true;
};

// Search for member by ID (utility)
export const validateMemberId = (memberId: string): boolean => {
  return /^404-\d{4}-\d{3}$/.test(memberId);
};
