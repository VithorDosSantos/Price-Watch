import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { PriceBadge } from "./PriceBadge";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
}

export function StatsCard({ title, value, icon: Icon, change, changeLabel }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-2">
              <PriceBadge change={change} size="sm" />
              {changeLabel && (
                <span className="text-xs text-muted-foreground">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className="rounded-lg bg-violet-50 p-3">
          <Icon className="h-6 w-6 text-violet-600" />
        </div>
      </div>
    </Card>
  );
}
