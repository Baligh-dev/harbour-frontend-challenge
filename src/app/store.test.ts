// src/app/store.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useScholarshipStore } from "./store";
import * as scholarshipService from "../features/scholarship/api/scholarshipService";
import type { ScholarshipData } from "../features/scholarship/api/scholarshipService";

// Mock the service module so tests don't hit the real API
vi.mock("../features/scholarship/api/scholarshipService");

// Minimal mock data matching the ScholarshipData shape
const mockData = {
  id: 1,
  slug: "test-scholarship",
  scholarship: {
    id: 1,
    name: "Test Scholarship",
    company: { name: "Test Corp" },
  },
} as unknown as ScholarshipData;

describe("useScholarshipStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useScholarshipStore.setState({
      data: null,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it("has the correct initial state", () => {
    const state = useScholarshipStore.getState();
    expect(state.data).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("sets isLoading to true while fetching", async () => {
    // Delay the mock so we can observe the loading state
    vi.mocked(scholarshipService.fetchScholarshipData).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockData), 50)),
    );

    const promise = useScholarshipStore.getState().fetchData();

    // Immediately after calling, isLoading should be true
    expect(useScholarshipStore.getState().isLoading).toBe(true);
    expect(useScholarshipStore.getState().data).toBeNull();

    await promise;
  });

  it("populates data and clears loading on success", async () => {
    vi.mocked(scholarshipService.fetchScholarshipData).mockResolvedValue(
      mockData,
    );

    await useScholarshipStore.getState().fetchData();

    const state = useScholarshipStore.getState();
    expect(state.data).toEqual(mockData);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("sets error and clears loading on failure", async () => {
    vi.mocked(scholarshipService.fetchScholarshipData).mockRejectedValue(
      new Error("Network error"),
    );

    await useScholarshipStore.getState().fetchData();

    const state = useScholarshipStore.getState();
    expect(state.data).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("Network error");
  });

  it("does not refetch if data is already present", async () => {
    // Pre-populate the store
    useScholarshipStore.setState({ data: mockData });

    const fetchSpy = vi.mocked(scholarshipService.fetchScholarshipData);
    await useScholarshipStore.getState().fetchData();

    // The fetch function should not have been called
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("does not trigger concurrent fetches while one is in flight", async () => {
    vi.mocked(scholarshipService.fetchScholarshipData).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockData), 50)),
    );

    const fetchSpy = vi.mocked(scholarshipService.fetchScholarshipData);

    // Fire two fetches back-to-back
    const first = useScholarshipStore.getState().fetchData();
    const second = useScholarshipStore.getState().fetchData();

    await Promise.all([first, second]);

    // Only the first should have actually called the API
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
