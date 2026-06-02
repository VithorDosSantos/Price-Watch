import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PriceBadge } from "../../../src/components/PriceBadge";
import React from "react";

describe("PriceBadge", () => {
  it("renders negative change with green styling", () => {
    render(<PriceBadge change={-10} />);

    const badge = screen.getByText(/-10/);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("green");
  });

  it("renders positive change with red styling", () => {
    render(<PriceBadge change={5} />);

    const badge = screen.getByText(/5/);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("red");
  });

  it("renders neutral change with gray styling", () => {
    render(<PriceBadge change={0} />);

    const badge = screen.getByText(/0/);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("gray");
  });

  it("respects showIcon=false", () => {
    const { container } = render(<PriceBadge change={-5} showIcon={false} />);

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(0);
  });

  it("applies size classes", () => {
    render(<PriceBadge change={-5} size="lg" />);

    const badge = screen.getByText(/-5/);
    expect(badge.className).toContain("text-base");
  });
});
