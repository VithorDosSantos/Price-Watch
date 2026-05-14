import { Heart } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/EmptyState";
import { mockProducts, favoriteProducts } from "../data/mockData";
import { useNavigate } from "react-router-dom";

export function FavoritesPage() {
  const navigate = useNavigate();
  const favorites = mockProducts.filter((p) => favoriteProducts.includes(p.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Produtos Favoritos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie sua lista de produtos favoritos
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nenhum produto favorito"
          description="Você ainda não adicionou produtos aos seus favoritos. Explore nossa seleção e salve seus produtos preferidos para acompanhar facilmente!"
          actionLabel="Explorar produtos"
          onAction={() => navigate("/")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} {...product} isFavorite={true} />
          ))}
        </div>
      )}
    </div>
  );
}
