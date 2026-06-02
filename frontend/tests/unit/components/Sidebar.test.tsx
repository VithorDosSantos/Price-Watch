import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Sidebar } from "../../../src/components/Sidebar";

function renderSidebar(path = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar />
    </MemoryRouter>
  );
}

describe("Sidebar", () => {
  it("renders navigation links", () => {
    renderSidebar();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Favoritos")).toBeInTheDocument();
    expect(screen.getByText("Alertas")).toBeInTheDocument();
  });

  it("highlights active link", () => {
    renderSidebar("/favorites");
    const favLink = screen.getByText("Favoritos").closest("a");
    expect(favLink?.className).toContain("violet");
  });

  it("renders all navigation items", () => {
    renderSidebar();
    expect(screen.getByText("Lojas")).toBeInTheDocument();
    expect(screen.getByText("Categorias")).toBeInTheDocument();
    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText("Perfil")).toBeInTheDocument();
  });
});
