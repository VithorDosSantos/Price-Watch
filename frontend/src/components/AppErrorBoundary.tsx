import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends React.Component<
  React.PropsWithChildren,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Tela quebrada", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
          <Card className="max-w-lg p-6 text-center">
            <h1 className="text-2xl font-bold">Não foi possível carregar esta tela</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Atualize a página ou volte para a busca inicial. Se o problema continuar, confira se o
              back-end local está online.
            </p>
            <Button
              className="mt-6 bg-violet-600 hover:bg-violet-700"
              onClick={() => window.location.assign("/")}
            >
              Voltar para início
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
