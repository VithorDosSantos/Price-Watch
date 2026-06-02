import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppErrorBoundary } from "../../../src/components/AppErrorBoundary";

describe("AppErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <AppErrorBoundary>
        <div>OK</div>
      </AppErrorBoundary>
    );
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("catches error and shows fallback", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Bomb() {
      throw new Error("boom");
    }

    render(
      <AppErrorBoundary>
        <Bomb />
      </AppErrorBoundary>
    );

    expect(screen.getByText(/Não foi possível carregar/i)).toBeInTheDocument();
    spy.mockRestore();
  });
});
