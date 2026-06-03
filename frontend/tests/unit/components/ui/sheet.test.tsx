import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../../../../src/components/ui/sheet";

describe("ui/sheet", () => {
  it("renders sheet primitives and default content", () => {
    const { container } = render(
      <Sheet open>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Panel title</SheetTitle>
            <SheetDescription>Panel description</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>Close button</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText("Panel title")).toBeInTheDocument();
    expect(screen.getByText("Panel description")).toBeInTheDocument();
    expect(screen.getByText("Close button")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();

    expect(container.querySelector('[data-slot="sheet-trigger"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sheet-content"]')).toHaveClass("border-l");
    expect(document.querySelector('[data-slot="sheet-overlay"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sheet-title"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sheet-description"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sheet-header"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sheet-footer"]')).toBeInTheDocument();
  });

  it("applies side-specific classes", () => {
    const { rerender } = render(
      <Sheet open>
        <SheetContent side="left">
          <SheetTitle>Left</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    expect(document.querySelector('[data-slot="sheet-content"]')).toHaveClass("border-r");

    rerender(
      <Sheet open>
        <SheetContent side="top">
          <SheetTitle>Top</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(document.querySelector('[data-slot="sheet-content"]')).toHaveClass("border-b");

    rerender(
      <Sheet open>
        <SheetContent side="bottom">
          <SheetTitle>Bottom</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(document.querySelector('[data-slot="sheet-content"]')).toHaveClass("border-t");
  });
});
