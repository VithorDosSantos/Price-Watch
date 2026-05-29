import { Package, Bell, TrendingDown, Eye } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { ProductCard } from "../components/ProductCard";
import { Card } from "../components/ui/card";
import { PriceBadge } from "../components/PriceBadge";
import { listFavorites, listPriceHistory, mapProductToCard } from "../services/api";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export function DashboardPage() {
  const [favorites, setFavorites] = useState<Record<string, unknown>[]>([]);
  const [priceHistory, setPriceHistory] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const favs = await listFavorites();
        setFavorites(favs.map((f) => mapProductToCard(f.product)));
        const history = await listPriceHistory();
        setPriceHistory(history);
      } catch (err) {
        console.error("Failed to load dashboard", err);
        setFavorites([]);
        setPriceHistory([]);
      }
    }

    void load();
  }, []);

  const chartData = [
    { value: 320 },
    { value: 280 },
    { value: 350 },
    { value: 310 },
    { value: 380 },
    { value: 340 },
    { value: 400 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Painel</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Resumo rápido dos produtos que você acompanha.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Itens acompanhados"
          value={priceHistory.length}
          icon={Eye}
          change={12.5}
          changeLabel="vs. mês passado"
        />
        <StatsCard
          title="Alertas ativos"
          value={4}
          icon={Bell}
          change={-5.2}
          changeLabel="vs. mês passado"
        />
        <StatsCard
          title="Favoritos"
          value={favorites.length}
          icon={Package}
          change={8.1}
          changeLabel="vs. mês passado"
        />
        <StatsCard
          title="Economia estimada"
          value="R$ 2.450"
          icon={TrendingDown}
          change={-15.3}
          changeLabel="neste mês"
        />
      </div>

      {/* Recent Price Drops */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Maiores quedas</h2>
            <p className="text-sm text-muted-foreground">
              Atualizado com os últimos registros salvos
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Loja</TableHead>
              <TableHead>Preço Atual</TableHead>
              <TableHead>Variação</TableHead>
              <TableHead className="text-right">Tendência</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {priceHistory.slice(0, 5).map((entry, idx) => (
              <TableRow key={`${entry.id}-${idx}`}>
                <TableCell className="font-medium max-w-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        entry.imageUrl ??
                        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"
                      }
                      alt={entry.productName}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <span className="truncate">{entry.productName}</span>
                  </div>
                </TableCell>
                <TableCell>{entry.storeName ?? "-"}</TableCell>
                <TableCell className="font-bold">
                  R$ {entry.newPrice.toLocaleString("pt-BR")}
                </TableCell>
                <TableCell>
                  <PriceBadge change={-8.5} />
                </TableCell>
                <TableCell className="text-right">
                  <ResponsiveContainer width={80} height={30}>
                    <LineChart data={chartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Favorite Products */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Favoritos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Itens salvos para você voltar quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} {...product} isFavorite={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
