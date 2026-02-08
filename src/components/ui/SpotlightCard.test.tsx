import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";

let mockIsMobile = false;
vi.mock("../../hooks/useIsMobile", () => ({
  useIsMobile: () => mockIsMobile,
}));

import SpotlightCard from "./SpotlightCard";

describe("SpotlightCard", () => {
  beforeEach(() => {
    mockIsMobile = false;
  });

  it("renders plain div without spotlight on mobile", () => {
    mockIsMobile = true;

    const { container } = render(
      <SpotlightCard>
        <p>Card content</p>
      </SpotlightCard>,
    );

    const wrapper = container.firstChild as HTMLElement;
    const spotlightLayers = wrapper.querySelectorAll(".pointer-events-none");
    expect(spotlightLayers.length).toBe(0);
  });

  it("renders spotlight layers on desktop", () => {
    const { container } = render(
      <SpotlightCard>
        <p>Card content</p>
      </SpotlightCard>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.classList.contains("group")).toBe(true);

    const spotlightLayers = wrapper.querySelectorAll(".pointer-events-none");
    expect(spotlightLayers.length).toBe(2);
  });

  it("handles mouse move without crashing", () => {
    const { container } = render(
      <SpotlightCard>
        <p>Card content</p>
      </SpotlightCard>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(() => {
      fireEvent.mouseMove(wrapper, { clientX: 150, clientY: 200 });
    }).not.toThrow();
  });
});
