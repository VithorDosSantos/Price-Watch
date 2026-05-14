import { Package, Bell, TrendingDown, Eye } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { ProductCard } from "../components/ProductCard";
import { Card } from "../components/ui/card";
import { PriceBadge } from "../components/PriceBadge";
import { mockProducts, favoriteProducts } from "../data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export function DashboardPage() {
  const favorites = mockProducts.filter((p) => favoriteProducts.includes(p.id));

  const recentDrops = mockProducts
    .filter((p) => p.priceChange && p.priceChange < 0)
    .sort((a, b) => (a.priceChange || 0) - (b.priceChange || 0))
    .slice(0, 5);

  const chartData = [
    { value: 320 },
    { value: 280 },
    { value: 350 },
    { value: 310 },
    { value: 380 },
    { value: 340 },
    { value: 400 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Visão geral dos seus produtos monitorados
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Produtos Monitorados"
          value={mockProducts.length}
          icon={Eye}
          change={12.5}
          changeLabel="vs. mês passado"
        />
        <StatsCard
          title="Alertas Ativos"
          value={4}
          icon={Bell}
          change={-5.2}
          changeLabel="vs. mês passado"
        />
        <StatsCard
          title="Produtos Favoritos"
          value={favorites.length}
          icon={Package}
          change={8.1}
          changeLabel="vs. mês passado"
        />
        <StatsCard
          title="Economia Total"
          value="R$ 2.450"
          icon={TrendingDown}
          change={-15.3}
          changeLabel="este mês"
        />
      </div>

      {/* Recent Price Drops */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Maiores Quedas de Preço</h2>
            <p className="text-sm text-muted-foreground">Nos últimos 7 dias</p>
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
            {recentDrops.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium max-w-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <span className="truncate">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>{product.store}</TableCell>
                <TableCell className="font-bold">
                  R$ {product.currentPrice.toLocaleString("pt-BR")}
                </TableCell>
                <TableCell>
                  <PriceBadge change={product.priceChange || 0} />
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
          <h2 className="text-2xl font-bold">Produtos Favoritos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Seus produtos salvos para acompanhamento rápido
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
