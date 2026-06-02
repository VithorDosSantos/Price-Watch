import { Link } from "react-router-dom";

export function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Painel administrativo</h1>
      <p>Use esta área para organizar o sistema e manter os cadastros atualizados.</p>
      <ul className="space-y-3">
        <li>
          <Link to="/admin/products" className="text-violet-600 underline">
            Produtos
          </Link>
        </li>
        <li>
          <Link to="/stores" className="text-violet-600 underline">
            Lojas
          </Link>
        </li>
        <li>
          <Link to="/categories" className="text-violet-600 underline">
            Categorias
          </Link>
        </li>
        <li>
          <Link to="/price-history" className="text-violet-600 underline">
            Histórico de preços
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="text-violet-600 underline">
            Usuários
          </Link>
        </li>
      </ul>
    </div>
  );
}
