// Local Storage Utility to replace Firebase
export const db = {
  // Mimic the collection structure
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  set: (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  generateId: () => Math.random().toString(36).substring(2, 11)
};

// Mock Auth and Storage for minimal disruption
export const auth = {
  currentUser: { uid: "local-admin", email: "admin@the404society.in" }
};

export const storage = {
  // Empty mock for storage
};
