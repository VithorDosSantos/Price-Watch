import { useEffect, useMemo, useState } from "react";
import { Clock3, PencilLine, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import {
  createPriceHistory,
  deletePriceHistory,
  listPriceHistory,
  updatePriceHistory,
  type PriceHistoryRecord
} from "../services/api";
import { toast } from "sonner";

type PriceHistoryFormState = {
  productName: string;
  oldPrice: string;
  newPrice: string;
  capturedAt: string;
};

const emptyForm: PriceHistoryFormState = {
  productName: "",
  oldPrice: "",
  newPrice: "",
  capturedAt: new Date().toISOString().slice(0, 16)
};

export function PriceHistoryPage() {
  const [records, setRecords] = useState<PriceHistoryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PriceHistoryRecord | null>(null);
  const [form, setForm] = useState<PriceHistoryFormState>(emptyForm);

  useEffect(() => {
    void listPriceHistory()
      .then(setRecords)
      .catch(() => {
        setRecords([]);
        toast.error("Não foi possível carregar o histórico de preços.");
      });
  }, []);

  const filteredRecords = useMemo(
    () => records.filter((record) => (record.productName ?? "").toLowerCase().includes(searchQuery.toLowerCase())),
    [records, searchQuery]
  );

  function openCreateDialog() {
    setEditingRecord(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEditDialog(record: PriceHistoryRecord) {
    setEditingRecord(record);
    setForm({
      productName: record.productName,
      oldPrice: String(record.oldPrice),
      newPrice: String(record.newPrice),
      capturedAt: new Date(record.capturedAt).toISOString().slice(0, 16)
    });
    setOpen(true);
  }

  async function handleSubmit() {
    try {
      const payload = {
        productName: form.productName,
        oldPrice: Number(form.oldPrice),
        newPrice: Number(form.newPrice),
        capturedAt: new Date(form.capturedAt).toISOString()
      };

      if (editingRecord) {
        const updated = await updatePriceHistory(editingRecord.id, payload);
        setRecords((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        toast.success("Histórico atualizado com sucesso!");
      } else {
        const created = await createPriceHistory(payload);
        setRecords((current) => [created, ...current]);
        toast.success("Histórico criado com sucesso!");
      }

      setOpen(false);
      setEditingRecord(null);
      setForm(emptyForm);
    } catch {
      toast.error("Não foi possível salvar o histórico.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePriceHistory(id);
      setRecords((current) => current.filter((item) => item.id !== id));
      toast.success("Registro removido com sucesso!");
    } catch {
      toast.error("Não foi possível remover o histórico.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico de Preços</h1>
          <p className="text-muted-foreground mt-2">CRUD para registrar e manter a evolução de preços por produto.</p>
        </div>

        <Button className="bg-violet-600 hover:bg-violet-700" onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo registro
        </Button>
      </div>

      <Card className="p-6">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar produto..."
            className="pl-10"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Preço anterior</TableHead>
                <TableHead>Novo preço</TableHead>
                <TableHead>Variação</TableHead>
                <TableHead>Capturado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => {
                const difference = record.newPrice - record.oldPrice;
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium max-w-sm">{record.productName}</TableCell>
                    <TableCell>R$ {record.oldPrice.toLocaleString("pt-BR")}</TableCell>
                    <TableCell>R$ {record.newPrice.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className={difference <= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {difference <= 0 ? "-" : "+"}
                      R$ {Math.abs(difference).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>{new Date(record.capturedAt).toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(record)}>
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => void handleDelete(record.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRecord ? "Editar histórico" : "Novo registro"}</DialogTitle>
            <DialogDescription>
              Use este cadastro para demonstrar a evolução de preço dos produtos monitorados.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="history-product">Produto</Label>
              <Input
                id="history-product"
                value={form.productName}
                onChange={(event) => setForm((current) => ({ ...current, productName: event.target.value }))}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="history-old-price">Preço anterior</Label>
                <Input
                  id="history-old-price"
                  type="number"
                  value={form.oldPrice}
                  onChange={(event) => setForm((current) => ({ ...current, oldPrice: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="history-new-price">Novo preço</Label>
                <Input
                  id="history-new-price"
                  type="number"
                  value={form.newPrice}
                  onChange={(event) => setForm((current) => ({ ...current, newPrice: event.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="history-captured-at">Data de captura</Label>
              <Input
                id="history-captured-at"
                type="datetime-local"
                value={form.capturedAt}
                onChange={(event) => setForm((current) => ({ ...current, capturedAt: event.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => void handleSubmit()}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
