import { BarChart3, Bell, Clock3, Heart, Home, Layers3, Menu, Search, Store, TrendingDown, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { cn } from "./ui/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Favoritos", href: "/favorites", icon: Heart },
  { name: "Alertas", href: "/alerts", icon: Bell },
  { name: "Lojas", href: "/stores", icon: Store },
  { name: "Categorias", href: "/categories", icon: Layers3 },
  { name: "Histórico", href: "/price-history", icon: Clock3 }
];

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const token = user ? localStorage.getItem("pw_token") : null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-8">
          {!isHome && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                      <TrendingDown className="h-4 w-4 text-white" />
                    </div>
                    PriceWatch
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setOpen(false)}
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
              </SheetContent>
            </Sheet>
          )}

          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 transition-transform group-hover:scale-105">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">PriceWatch</span>
          </Link>

          {!isHome && (
            <div className="hidden md:flex relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Buscar produtos..." className="pl-10 bg-gray-50/50" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/alerts"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Ir para alertas"
            title="Ir para alertas"
          >
            <Bell className="h-5 w-5" />
          </Link>
          {token ? (
            <div className="flex items-center gap-2">
              {user?.role === "ADMIN" && <Link to="/admin" className="text-sm text-violet-600">Admin</Link>}
              <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }}>
                <User className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm">Entrar</Link>
              <Link to="/register" className="text-sm text-violet-600">Criar conta</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
