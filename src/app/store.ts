import { create } from "zustand";
import { fetchScholarshipData } from "../features/scholarship/api/scholarshipService";
import type { ScholarshipData } from "../features/scholarship/api/scholarshipService";

interface ScholarshipState {
  data: ScholarshipData | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useScholarshipStore = create<ScholarshipState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchData: async () => {
    // 🛑 Guard: skip if we already have data or a fetch is in flight
    if (get().data || get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const data = await fetchScholarshipData();
      set({ data, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },
}));
