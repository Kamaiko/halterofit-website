import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./useIsMobile";

function createMockMql(overrides: Partial<MediaQueryList> = {}) {
  return {
    matches: false,
    media: "(max-width: 767px)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
    ...overrides,
  } as unknown as MediaQueryList;
}

describe("useIsMobile", () => {
  beforeEach(() => {
    // Reset to setup.ts default (all queries return matches: false)
    window.matchMedia = vi.fn(() => createMockMql());
  });

  it("returns false for desktop viewport", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("reacts to viewport changes", () => {
    let changeHandler: ((e: MediaQueryListEvent) => void) | undefined;

    window.matchMedia = vi.fn(() =>
      createMockMql({
        addEventListener: vi.fn((_event: string, handler: EventListenerOrEventListenerObject) => {
          changeHandler = handler as (e: MediaQueryListEvent) => void;
        }),
      }),
    );

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      changeHandler?.({ matches: true } as MediaQueryListEvent);
    });
    expect(result.current).toBe(true);

    act(() => {
      changeHandler?.({ matches: false } as MediaQueryListEvent);
    });
    expect(result.current).toBe(false);
  });

  it("cleans up event listener on unmount", () => {
    const removeSpy = vi.fn();

    window.matchMedia = vi.fn(() =>
      createMockMql({ removeEventListener: removeSpy }),
    );

    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
