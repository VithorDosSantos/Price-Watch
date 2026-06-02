import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AdminPage } from "../../../src/pages/AdminPage";

describe("AdminPage", () => {
  it("renders admin panel", () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Painel administrativo")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Lojas")).toBeInTheDocument();
  });
});
