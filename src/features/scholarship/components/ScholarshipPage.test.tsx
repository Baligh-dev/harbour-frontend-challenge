// src/features/scholarship/components/ScholarshipPage.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScholarshipPage } from "./ScholarshipPage";
import { useScholarshipStore } from "../../../app/store";
import type { ScholarshipData } from "../api/scholarshipService";

// Mock heavy child components so we isolate ScholarshipPage's own logic
vi.mock("./HeaderSection", () => ({
  HeaderSection: () => <div data-testid="header-section">Header</div>,
}));
vi.mock("./InteractionSection", () => ({
  InteractionSection: () => (
    <div data-testid="interaction-section">Interaction</div>
  ),
}));
vi.mock("./AboutSection", () => ({
  AboutSection: () => <div data-testid="about-section">About</div>,
}));
vi.mock("./Testimonials", () => ({
  Testimonials: () => <div data-testid="testimonials">Testimonials</div>,
}));
vi.mock("./FAQSection", () => ({
  FAQSection: () => <div data-testid="faq-section">FAQ</div>,
}));
vi.mock("./StickyBar", () => ({
  StickyBar: () => <div data-testid="sticky-bar">Sticky Bar</div>,
}));

// Minimal mock data
const mockData = {
  id: 1,
  slug: "test",
  scholarship: {
    id: 1,
    name: "Test Scholarship",
  },
} as unknown as ScholarshipData;

describe("ScholarshipPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the store to a known state
    useScholarshipStore.setState({
      data: null,
      isLoading: false,
      error: null,
      fetchData: vi.fn(), // Prevent the real fetch from firing
    });
  });

  it("renders the loading state", () => {
    useScholarshipStore.setState({ isLoading: true });

    render(<ScholarshipPage />);

    expect(screen.getByText(/loading scholarship data/i)).toBeInTheDocument();
  });

  it("renders the error state", () => {
    useScholarshipStore.setState({ error: "Something went wrong" });

    render(<ScholarshipPage />);

    expect(
      screen.getByText(/error: something went wrong/i),
    ).toBeInTheDocument();
  });

  it('renders "no data" when there is no data and no error', () => {
    render(<ScholarshipPage />);

    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it("renders all main sections when data is loaded", () => {
    useScholarshipStore.setState({ data: mockData });

    render(<ScholarshipPage />);

    expect(screen.getByTestId("header-section")).toBeInTheDocument();
    expect(screen.getByTestId("interaction-section")).toBeInTheDocument();
    expect(screen.getByTestId("about-section")).toBeInTheDocument();
    expect(screen.getByTestId("testimonials")).toBeInTheDocument();
    expect(screen.getByTestId("faq-section")).toBeInTheDocument();
    expect(screen.getByTestId("sticky-bar")).toBeInTheDocument();
  });
});
