import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: Readonly<EmptyStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="rounded-full bg-gray-100 p-6 mb-6">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-violet-600 hover:bg-violet-700">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
