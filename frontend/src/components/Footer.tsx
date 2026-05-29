import { Link } from "react-router-dom";
import { TrendingDown, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50/50 mt-auto">
      <div className="container px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <TrendingDown className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">PriceWatch</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Monitore preços e economize dinheiro nas suas compras online.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-100 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-100 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-100 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="hover:text-foreground transition-colors">
                  Alertas
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-foreground transition-colors">
                  Favoritos
                </Link>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors">Extensão Chrome</span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-foreground transition-colors">Sobre</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors">Blog</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors">Carreiras</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors">Contato</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-foreground transition-colors">Privacidade</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors">Termos de Uso</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors">Cookies</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors">Licenças</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 PriceWatch. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
