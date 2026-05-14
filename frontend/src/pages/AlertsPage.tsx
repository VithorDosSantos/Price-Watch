import { useState } from "react";
import { Bell, Plus, Trash2, Search } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { mockAlerts } from "../data/mockData";
import { toast } from "sonner";

export function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlerts = alerts.filter((alert) =>
    alert.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeAlerts = alerts.filter((a) => a.active).length;

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map((a) => {
      if (a.id === id) {
        const newActive = !a.active;
        toast.success(newActive ? "Alerta ativado com sucesso!" : "Alerta desativado");
        return { ...a, active: newActive };
      }
      return a;
    }));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    toast.success("Alerta removido com sucesso!");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Alertas de Preço</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Gerencie seus alertas e seja notificado quando os preços caírem
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Criar alerta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Alerta de Preço</DialogTitle>
              <DialogDescription>
                Configure um alerta para ser notificado quando o preço atingir o valor desejado
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                <Input
                  id="product"
                  placeholder="Digite o nome do produto ou cole o link..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço desejado (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0,00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700"
                onClick={() => {
                  toast.success("Alerta criado com sucesso!", {
                    description: "Você será notificado quando o preço atingir o valor desejado."
                  });
                }}
              >
                Criar alerta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Alertas</p>
              <p className="text-3xl font-bold mt-2">{alerts.length}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-violet-50 flex items-center justify-center">
              <Bell className="h-6 w-6 text-violet-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alertas Ativos</p>
              <p className="text-3xl font-bold mt-2">{activeAlerts}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center">
              <Bell className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alertas Disparados</p>
              <p className="text-3xl font-bold mt-2">12</p>
              <p className="text-xs text-green-600 mt-1">Este mês</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar alertas..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Alerts Table */}
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Nenhum alerta encontrado</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Tente buscar por outro termo"
                : "Crie seu primeiro alerta para começar"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Preço Alvo</TableHead>
                    <TableHead>Preço Atual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => {
                    const difference = alert.currentPrice - alert.targetPrice;
                    const percentDiff = (difference / alert.currentPrice) * 100;

                    return (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium max-w-xs">
                          <span className="truncate block">{alert.productName}</span>
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          R$ {alert.targetPrice.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold">
                              R$ {alert.currentPrice.toLocaleString("pt-BR")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {difference > 0 ? "+" : ""}
                              {percentDiff.toFixed(1)}% do alvo
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={alert.active}
                              onCheckedChange={() => toggleAlert(alert.id)}
                            />
                            <Badge
                              variant={alert.active ? "default" : "secondary"}
                              className={alert.active ? "bg-green-600" : ""}
                            >
                              {alert.active ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredAlerts.map((alert) => {
                const difference = alert.currentPrice - alert.targetPrice;
                const percentDiff = (difference / alert.currentPrice) * 100;

                return (
                  <Card key={alert.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-sm line-clamp-2 flex-1">
                          {alert.productName}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Preço Alvo</p>
                          <p className="font-bold text-green-600">
                            R$ {alert.targetPrice.toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Preço Atual</p>
                          <p className="font-semibold">
                            R$ {alert.currentPrice.toLocaleString("pt-BR")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {difference > 0 ? "+" : ""}
                            {percentDiff.toFixed(1)}% do alvo
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={alert.active}
                            onCheckedChange={() => toggleAlert(alert.id)}
                          />
                          <Badge
                            variant={alert.active ? "default" : "secondary"}
                            className={alert.active ? "bg-green-600" : ""}
                          >
                            {alert.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* How it works */}
      <Card className="p-6 bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200">
        <h3 className="font-semibold mb-3">Como funcionam os alertas?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-violet-600">•</span>
            <span>Monitore produtos 24/7 automaticamente</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-600">•</span>
            <span>Receba notificações por email quando o preço atingir o valor desejado</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-600">•</span>
            <span>Ative ou desative alertas a qualquer momento</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-600">•</span>
            <span>Sem limite de alertas ativos</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
