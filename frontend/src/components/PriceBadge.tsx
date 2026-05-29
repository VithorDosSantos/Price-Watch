import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface PriceBadgeProps {
  change: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function PriceBadge({ change, showIcon = true, size = "md" }: PriceBadgeProps) {
  const isNegative = change < 0;
  const isNeutral = change === 0;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-medium gap-1",
        sizeClasses[size],
        isNegative && "bg-green-50 text-green-700 border-green-200",
        !isNegative && !isNeutral && "bg-red-50 text-red-700 border-red-200",
        isNeutral && "bg-gray-100 text-gray-700 border-gray-200"
      )}
    >
      {showIcon && (
        <>
          {isNegative && <TrendingDown className={iconSizes[size]} />}
          {!isNegative && !isNeutral && <TrendingUp className={iconSizes[size]} />}
          {isNeutral && <Minus className={iconSizes[size]} />}
        </>
      )}
      {isNegative ? "" : "+"}
      {change.toFixed(1)}%
    </Badge>
  );
}
