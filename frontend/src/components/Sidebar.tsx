import { BarChart3, Bell, Heart, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "./ui/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Favoritos", href: "/favorites", icon: Heart },
  { name: "Alertas", href: "/alerts", icon: Bell }
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-gray-50/40">
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-violet-50 text-violet-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
