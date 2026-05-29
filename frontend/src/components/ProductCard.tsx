import { Link, useNavigate } from "react-router-dom";
import { Heart, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";
import { deleteFavorite, favoriteProduct } from "../services/api";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  currentPrice: number;
  originalPrice?: number;
  store: string;
  priceChange?: number;
  isFavorite?: boolean;
  favoriteId?: string;
  onFavoriteRemoved?: (favoriteId: string) => void;
}

export function ProductCard({
  id,
  name,
  image,
  currentPrice,
  originalPrice,
  store,
  priceChange,
  isFavorite = false,
  favoriteId,
  onFavoriteRemoved
}: Readonly<ProductCardProps>) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const discount = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  async function handleFavoriteClick() {
    if (!user) {
      toast.error("Faça login para salvar favoritos.");
      navigate("/login");
      return;
    }

    if (isFavorite) {
      if (favoriteId) {
        try {
          await deleteFavorite(favoriteId);
          toast.success("Produto removido dos favoritos.");
          onFavoriteRemoved?.(favoriteId);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Não foi possível remover o favorito.");
        }
        return;
      }

      navigate("/favorites");
      return;
    }

    try {
      await favoriteProduct(id);
      toast.success("Produto salvo nos favoritos.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar o favorito.");
    }
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg border-gray-200">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => void handleFavoriteClick()}
          className={cn(
            "absolute right-2 top-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur hover:bg-white",
            isFavorite && "text-red-500"
          )}
          aria-label={isFavorite ? "Ver favoritos" : "Salvar nos favoritos"}
          title={isFavorite ? "Ver favoritos" : "Salvar nos favoritos"}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </Button>
        {discount > 0 && <Badge className="absolute left-2 top-2 bg-green-600">-{discount}%</Badge>}
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-medium line-clamp-2 text-sm leading-tight">{name}</h3>
          <p className="text-xs text-muted-foreground">{store}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">R$ {currentPrice.toLocaleString("pt-BR")}</span>
          {originalPrice && originalPrice > currentPrice && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {originalPrice.toLocaleString("pt-BR")}
            </span>
          )}
        </div>

        {priceChange !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              priceChange < 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {priceChange < 0 ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            {Math.abs(priceChange)}% esta semana
          </div>
        )}

        <Link to={`/product/${id}`}>
          <Button className="w-full bg-violet-600 hover:bg-violet-700">Ver detalhes</Button>
        </Link>
      </div>
    </Card>
  );
}
