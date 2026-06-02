import { BarChart3, Bell, Heart, Home, Layers3, Store, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "./ui/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Favoritos", href: "/favorites", icon: Heart },
  { name: "Alertas", href: "/alerts", icon: Bell },
  { name: "Lojas", href: "/stores", icon: Store },
  { name: "Categorias", href: "/categories", icon: Layers3 },
  { name: "Perfil", href: "/profile", icon: User }
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const items =
    user?.role === "ADMIN"
      ? [...navigation, { name: "Produtos", href: "/admin/products", icon: Layers3 }]
      : navigation;

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-gray-50/40">
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
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
