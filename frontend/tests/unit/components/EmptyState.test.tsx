import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { EmptyState } from "../../../src/components/EmptyState";
import { Search } from "lucide-react";
import React from "react";

describe("EmptyState", () => {
  it("renders icon, title and description", () => {
    render(<EmptyState icon={Search} title="Nada encontrado" description="Tente outra busca" />);

    expect(screen.getByText("Nada encontrado")).toBeInTheDocument();
    expect(screen.getByText("Tente outra busca")).toBeInTheDocument();
  });

  it("renders action button when actionLabel and onAction provided", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();

    render(
      <EmptyState
        icon={Search}
        title="Vazio"
        description="Desc"
        actionLabel="Criar"
        onAction={onAction}
      />
    );

    const button = screen.getByText("Criar");
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("does not render button when no action provided", () => {
    render(<EmptyState icon={Search} title="Vazio" description="Desc" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
