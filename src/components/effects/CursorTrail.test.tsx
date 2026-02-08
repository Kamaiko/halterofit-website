import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

// Override matchMedia BEFORE module evaluation so HAS_FINE_POINTER = true
vi.hoisted(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query === "(pointer: fine)",
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

let mockIsMobile = false;
vi.mock("../../hooks/useIsMobile", () => ({
  useIsMobile: () => mockIsMobile,
}));

let mockReducedMotion = false;
vi.mock("../../constants/accessibility", () => ({
  get REDUCED_MOTION() {
    return mockReducedMotion;
  },
}));

import CursorTrail from "./CursorTrail";

describe("CursorTrail", () => {
  beforeEach(() => {
    mockIsMobile = false;
    mockReducedMotion = false;
  });

  it("returns null on mobile", () => {
    mockIsMobile = true;

    const { container } = render(<CursorTrail />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when reduced motion is enabled", () => {
    mockReducedMotion = true;

    const { container } = render(<CursorTrail />);
    expect(container.firstChild).toBeNull();
  });

  it("renders cursor elements when all conditions pass", () => {
    const { container } = render(<CursorTrail />);

    // Should render ring (motion.div) + dot (div)
    const elements = container.querySelectorAll(".pointer-events-none");
    expect(elements.length).toBe(2);
  });
});
