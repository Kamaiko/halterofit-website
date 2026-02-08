import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

function ThrowingChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("test error");
  return <p>Safe child</p>;
}

describe("ErrorBoundary", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary fallback={<p>Fallback</p>}>
        <p>Content</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.queryByText("Fallback")).not.toBeInTheDocument();
  });

  it("renders fallback when child throws", () => {
    render(
      <ErrorBoundary fallback={<p>Fallback</p>}>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Fallback")).toBeInTheDocument();
    expect(screen.queryByText("Safe child")).not.toBeInTheDocument();
  });

  it("stays in error state after catching (no auto-recovery)", () => {
    const { rerender } = render(
      <ErrorBoundary fallback={<p>Fallback</p>}>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Fallback")).toBeInTheDocument();

    // Rerender with non-throwing child — boundary has no reset, stays in error
    rerender(
      <ErrorBoundary fallback={<p>Fallback</p>}>
        <ThrowingChild shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Fallback")).toBeInTheDocument();
    expect(screen.queryByText("Safe child")).not.toBeInTheDocument();
  });
});
