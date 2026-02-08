import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

const mockChangeLanguage = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "fr", changeLanguage: mockChangeLanguage },
  }),
}));

vi.mock("lenis/react", () => ({
  useLenis: () => null,
}));

vi.mock("lucide-react/dist/esm/icons/menu", () => ({
  default: (props: Record<string, unknown>) => <span data-testid="menu-icon" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/x", () => ({
  default: (props: Record<string, unknown>) => <span data-testid="x-icon" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/globe", () => ({
  default: (props: Record<string, unknown>) => <span data-testid="globe-icon" {...props} />,
}));

import Navbar from "./Navbar";

const NAV_SECTIONS = ["about", "projects", "skills", "contact"] as const;

describe("Navbar", () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    // Prevent bottom detection from triggering by default
    Object.defineProperty(window, "innerHeight", { value: 800, writable: true, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
    Object.defineProperty(document.body, "scrollHeight", { value: 5000, writable: true, configurable: true });

    // Create mock section elements in the DOM
    for (const id of NAV_SECTIONS) {
      const el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
  });

  afterEach(() => {
    for (const id of NAV_SECTIONS) {
      document.getElementById(id)?.remove();
    }
    vi.restoreAllMocks();
  });

  it("renders all 4 nav links", () => {
    render(<Navbar />);

    for (const id of NAV_SECTIONS) {
      expect(screen.getByText(`nav.${id}`)).toBeInTheDocument();
    }
  });

  it("toggles language on Globe button click", () => {
    render(<Navbar />);

    // Language is "fr" → button shows "EN"
    const langButton = screen.getByText("EN");
    fireEvent.click(langButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
  });

  it("opens and closes mobile menu", () => {
    render(<Navbar />);

    // Open menu
    const burger = screen.getByLabelText("Open menu");
    fireEvent.click(burger);

    // Mobile menu now renders duplicate nav links
    const aboutLinks = screen.getAllByText("nav.about");
    expect(aboutLinks.length).toBeGreaterThan(1);

    // Close by clicking a link
    fireEvent.click(aboutLinks[aboutLinks.length - 1]);

    // Menu closed — burger shows "Open menu" again
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
  });

  it("detects bottom scroll and activates contact", async () => {
    render(<Navbar />);

    // Mock scroll at page bottom
    Object.defineProperty(window, "innerHeight", { value: 800, writable: true, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 5000, writable: true, configurable: true });
    Object.defineProperty(document.body, "scrollHeight", { value: 5800, writable: true, configurable: true });

    fireEvent.scroll(window);

    await waitFor(() => {
      const contactLinks = screen.getAllByText("nav.contact");
      const desktopLink = contactLinks[0];
      expect(desktopLink.className).toContain("text-cyan-400");
    });
  });

  it("locks scroll spy for 1200ms after nav click (cooldown)", () => {
    vi.useFakeTimers();

    // Position "about" near the top so scroll spy picks it
    const aboutEl = document.getElementById("about")!;
    vi.spyOn(aboutEl, "getBoundingClientRect").mockReturnValue({
      top: 70, bottom: 1070, left: 0, right: 1000,
      width: 1000, height: 1000, x: 0, y: 70, toJSON: () => {},
    });

    render(<Navbar />);

    // Flush the initial RAF from onScroll() on mount
    act(() => {
      vi.advanceTimersByTime(16);
    });

    // Scroll spy should have detected "about"
    expect(screen.getByText("nav.about").className).toContain("text-cyan-400");

    // Click "projects" → sets activeSection, starts cooldown
    fireEvent.click(screen.getByText("nav.projects"));

    expect(screen.getByText("nav.projects").className).toContain("text-cyan-400");

    // Scroll event during cooldown should be ignored
    act(() => {
      fireEvent.scroll(window);
      vi.advanceTimersByTime(16);
    });

    // Still locked on "projects" (not back to "about")
    expect(screen.getByText("nav.projects").className).toContain("text-cyan-400");

    // Advance past cooldown (1200ms)
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // Now scroll spy can update — fire scroll + RAF
    act(() => {
      fireEvent.scroll(window);
      vi.advanceTimersByTime(16);
    });

    // Scroll spy re-detects "about"
    expect(screen.getByText("nav.about").className).toContain("text-cyan-400");

    vi.useRealTimers();
  });
});
