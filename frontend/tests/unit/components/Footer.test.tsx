import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Footer } from "../../../src/components/Footer";

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
}

describe("Footer", () => {
  it("renders brand name", () => {
    renderFooter();
    expect(screen.getByText("PriceWatch")).toBeInTheDocument();
  });

  it("renders product links", () => {
    renderFooter();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Alertas")).toBeInTheDocument();
    expect(screen.getByText("Favoritos")).toBeInTheDocument();
  });

  it("renders company section", () => {
    renderFooter();
    expect(screen.getByText("Empresa")).toBeInTheDocument();
    expect(screen.getByText("Sobre")).toBeInTheDocument();
  });

  it("renders social buttons", () => {
    renderFooter();
    expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders copyright text", () => {
    renderFooter();
    expect(screen.getByText(/Todos os direitos reservados/)).toBeInTheDocument();
  });
});
