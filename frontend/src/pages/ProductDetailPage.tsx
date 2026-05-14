import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Bell, ExternalLink, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { PriceBadge } from "../components/PriceBadge";
import { mockProducts } from "../data/mockData";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams();
  const product = mockProducts.find((p) => p.id === id);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const lowestPrice = Math.min(...product.priceHistory.map((h) => h.price));
  const highestPrice = Math.max(...product.priceHistory.map((h) => h.price));

  const handleCreateAlert = () => {
    toast.success("Alerta criado com sucesso!", {
      description: `Você será notificado quando o preço de "${product.name}" mudar.`,
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos!", {
      description: isFavorite
        ? "O produto foi removido da sua lista de favoritos."
        : "O produto foi adicionado à sua lista de favoritos.",
    });
  };

  return (
    <div className="container px-4 lg:px-8 py-8 max-w-7xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="aspect-square bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </Card>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold">
                R$ {product.currentPrice.toLocaleString("pt-BR")}
              </span>
              {product.originalPrice && product.originalPrice > product.currentPrice && (
                <span className="text-lg md:text-xl text-muted-foreground line-through">
                  R$ {product.originalPrice.toLocaleString("pt-BR")}
                </span>
              )}
            </div>

            {product.priceChange !== undefined && (
              <div className="flex items-center gap-2">
                <PriceBadge change={product.priceChange} size="lg" />
                <span className="text-xs md:text-sm text-muted-foreground">nos últimos 7 dias</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Vendido por</span>
              <span className="font-medium text-foreground">{product.store}</span>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 bg-violet-600 hover:bg-violet-700"
              size="lg"
              onClick={handleCreateAlert}
            >
              <Bell className="h-5 w-5 mr-2" />
              Criar alerta de preço
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="sm:w-auto"
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-5 w-5 sm:mr-0 ${isFavorite ? "fill-current text-red-500" : ""}`} />
              <span className="sm:hidden ml-2">{isFavorite ? "Favoritado" : "Favoritar"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Price History Chart */}
      <Card className="mt-12 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Histórico de Preços</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Últimos 30 dias
              </p>
            </div>
            <div className="flex gap-6 text-sm">
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

          <ResponsiveContainer width="100%" height={300}>
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
              <YAxis
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Preço"]}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString("pt-BR");
                }}
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

      {/* Store Comparison */}
      <Card className="mt-8 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Comparar entre lojas</h2>
        <div className="space-y-3">
          {product.stores.map((store, index) => (
            <div
              key={store.name}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {index === 0 && (
                  <Badge className="bg-green-600 whitespace-nowrap">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Melhor preço
                  </Badge>
                )}
                <span className="font-medium truncate">{store.name}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <span className="text-xl md:text-2xl font-bold whitespace-nowrap">
                  R$ {store.price.toLocaleString("pt-BR")}
                </span>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visitar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
