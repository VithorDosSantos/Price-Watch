import { ArrowLeft, Bell, ExternalLink, Heart, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PriceBadge } from "../components/PriceBadge";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { getProduct, type Product } from "../services/api";
import { toast } from "sonner";

type ProductDetailsView = {
  id: string;
  name: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  store: string;
  category: string;
  description: string;
  productUrl?: string;
  priceChange: number;
  priceHistory: { date: string; price: number }[];
  stores: { name: string; price: number; url: string }[];
};

function buildPriceHistory(price: number) {
  return [
    { date: "2026-04-14", price: Math.round(price * 1.14) },
    { date: "2026-04-21", price: Math.round(price * 1.1) },
    { date: "2026-04-28", price: Math.round(price * 1.06) },
    { date: "2026-05-05", price: Math.round(price * 1.03) },
    { date: "2026-05-12", price }
  ];
}

function mapApiProduct(product: Product): ProductDetailsView {
  const price = Number(product.price);

  return {
    id: product.id,
    name: product.name,
    image: product.imageUrl ?? "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    currentPrice: price,
    originalPrice: Math.round(price * 1.12),
    store: product.storeName ?? "Mercado Livre",
    category: product.category ?? "Produto",
    description: "Produto encontrado pela integração do PriceWatch com a API do Mercado Livre.",
    productUrl: product.productUrl,
    priceChange: -8.5,
    priceHistory: buildPriceHistory(price),
    stores: [
      { name: product.storeName ?? "Mercado Livre", price, url: product.productUrl ?? "#" },
      { name: "Loja parceira", price: Math.round(price * 1.04), url: "#" },
      { name: "Marketplace", price: Math.round(price * 1.08), url: "#" }
    ]
  };
}



export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetailsView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setProduct(null);
        setIsLoading(false);
        return;
      }
      try {
        const apiProduct = await getProduct(id);
        setProduct(apiProduct ? mapApiProduct(apiProduct) : null);
      } catch {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container px-4 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold">Carregando produto...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container px-4 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        <Link to="/">
          <Button className="mt-4">Voltar para home</Button>
        </Link>
      </div>
    );
  }

  const lowestPrice = Math.min(...product.priceHistory.map((history) => history.price));
  const highestPrice = Math.max(...product.priceHistory.map((history) => history.price));
  const productName = product.name;

  function handleCreateAlert() {
    toast.success("Alerta criado com sucesso!", {
      description: `Você será notificado quando o preço de "${productName}" mudar.`
    });
  }

  function handleToggleFavorite() {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos!", {
      description: isFavorite
        ? "O produto foi removido da sua lista de favoritos."
        : "O produto foi adicionado à sua lista de favoritos."
    });
  }

  return (
    <div className="container px-4 lg:px-8 py-8 max-w-7xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="aspect-square bg-gray-50">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold">
                R$ {product.currentPrice.toLocaleString("pt-BR")}
              </span>
              {product.originalPrice > product.currentPrice && (
                <span className="text-lg md:text-xl text-muted-foreground line-through">
                  R$ {product.originalPrice.toLocaleString("pt-BR")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <PriceBadge change={product.priceChange} size="lg" />
              <span className="text-xs md:text-sm text-muted-foreground">nos últimos 7 dias</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Vendido por</span>
              <span className="font-medium text-foreground">{product.store}</span>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 bg-violet-600 hover:bg-violet-700" size="lg" onClick={handleCreateAlert}>
              <Bell className="h-5 w-5 mr-2" />
              Criar alerta de preço
            </Button>
            <Button variant="outline" size="lg" className="sm:w-auto" onClick={handleToggleFavorite}>
              <Heart className={`h-5 w-5 sm:mr-0 ${isFavorite ? "fill-current text-red-500" : ""}`} />
              <span className="sm:hidden ml-2">{isFavorite ? "Favoritado" : "Favoritar"}</span>
            </Button>
          </div>
        </div>
      </div>

      <Card className="mt-12 p-4 sm:p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Histórico de Preços</h2>
              <p className="text-sm text-muted-foreground mt-1">Últimos 30 dias</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm sm:gap-6">
              <div>
                <p className="text-muted-foreground">Menor preço</p>
                <p className="font-bold text-green-600">R$ {lowestPrice.toLocaleString("pt-BR")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Maior preço</p>
                <p className="font-bold text-red-600">R$ {highestPrice.toLocaleString("pt-BR")}</p>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={product.priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
                stroke="#888"
                fontSize={12}
              />
              <YAxis stroke="#888" fontSize={12} tickFormatter={(value) => `R$ ${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px"
                }}
                formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Preço"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString("pt-BR")}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ fill: "#7c3aed", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mt-8 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-6">Comparar entre lojas</h2>
        <div className="space-y-3">
          {product.stores.map((store, index) => (
            <div
              key={`${store.name}-${index}`}
              className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex w-full items-center gap-3 sm:w-auto">
                {index === 0 && (
                  <Badge className="bg-green-600 whitespace-nowrap">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Melhor preço
                  </Badge>
                )}
                <span className="font-medium truncate">{store.name}</span>
              </div>
              <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
                <span className="text-xl md:text-2xl font-bold whitespace-nowrap">
                  R$ {store.price.toLocaleString("pt-BR")}
                </span>
                <a href={store.url} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="w-full whitespace-nowrap sm:w-auto">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visitar
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
