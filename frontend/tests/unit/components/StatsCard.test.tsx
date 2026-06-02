import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "../../../src/components/StatsCard";
import { Package } from "lucide-react";

describe("StatsCard", () => {
  it("renders title and value", () => {
    render(<StatsCard title="Total" value={42} icon={Package} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders with change badge", () => {
    render(
      <StatsCard title="Price" value="R$ 10" icon={Package} change={-5} changeLabel="vs ontem" />
    );
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("vs ontem")).toBeInTheDocument();
  });

  it("renders without change", () => {
    render(<StatsCard title="Items" value={0} icon={Package} />);
    expect(screen.getByText("Items")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
