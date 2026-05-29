import { useEffect, useMemo, useState } from "react";
import { Check, PencilLine, Plus, Search, Trash2, X } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { createStore, deleteStore, listStores, updateStore, type StoreRecord } from "../services/api";
import { toast } from "sonner";

type StoreFormState = {
  name: string;
  website: string;
  contactEmail: string;
  isActive: boolean;
};

const emptyForm: StoreFormState = {
  name: "",
  website: "",
  contactEmail: "",
  isActive: true
};

export function StoresPage() {
  const [stores, setStores] = useState<StoreRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreRecord | null>(null);
  const [form, setForm] = useState<StoreFormState>(emptyForm);

  useEffect(() => {
    void listStores()
      .then(setStores)
      .catch(() => {
        setStores([]);
        toast.error("Não foi possível carregar as lojas.");
      });
  }, []);

  const filteredStores = useMemo(
    () => stores.filter((store) => (store.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, stores]
  );

  function openCreateDialog() {
    setEditingStore(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEditDialog(store: StoreRecord) {
    setEditingStore(store);
    setForm({
      name: store.name,
      website: store.website,
      contactEmail: store.contactEmail,
      isActive: store.isActive
    });
    setOpen(true);
  }

  async function handleSubmit() {
    try {
      if (editingStore) {
        const updated = await updateStore(editingStore.id, form);
        setStores((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        toast.success("Loja atualizada com sucesso!");
      } else {
        const created = await createStore(form);
        setStores((current) => [created, ...current]);
        toast.success("Loja criada com sucesso!");
      }

      setOpen(false);
      setEditingStore(null);
      setForm(emptyForm);
    } catch {
      toast.error("Não foi possível salvar a loja.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteStore(id);
      setStores((current) => current.filter((item) => item.id !== id));
      toast.success("Loja removida com sucesso!");
    } catch {
      toast.error("Não foi possível remover a loja.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lojas</h1>
          <p className="text-muted-foreground mt-2">Cadastre e organize as lojas usadas nas comparações de preço.</p>
        </div>

        <Button className="bg-violet-600 hover:bg-violet-700" onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova loja
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Total cadastradas</p>
          <p className="mt-2 text-3xl font-bold">{stores.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Lojas ativas</p>
          <p className="mt-2 text-3xl font-bold">{stores.filter((store) => store.isActive).length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Lojas inativas</p>
          <p className="mt-2 text-3xl font-bold">{stores.filter((store) => !store.isActive).length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar loja"
            className="pl-10"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loja</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>
                    <a href={store.website} target="_blank" rel="noreferrer" className="text-violet-600 hover:underline">
                      {store.website}
                    </a>
                  </TableCell>
                  <TableCell>{store.contactEmail}</TableCell>
                  <TableCell>
                    <Badge variant={store.isActive ? "default" : "secondary"} className={store.isActive ? "bg-green-600" : ""}>
                      {store.isActive ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-3 w-3" /> Ativa
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <X className="h-3 w-3" /> Inativa
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(store)}>
                        <PencilLine className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => void handleDelete(store.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStore ? "Editar loja" : "Nova loja"}</DialogTitle>
            <DialogDescription>
              Mantenha a lista de lojas organizada para comparar preços com mais facilidade.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="store-name">Nome</Label>
              <Input
                id="store-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-website">Website</Label>
              <Input
                id="store-website"
                value={form.website}
                onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-email">Contato</Label>
              <Input
                id="store-email"
                value={form.contactEmail}
                onChange={(event) => setForm((current) => ({ ...current, contactEmail: event.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Ativa</p>
                <p className="text-sm text-muted-foreground">Define se a loja aparece nos fluxos do sistema.</p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((current) => ({ ...current, isActive: checked }))}
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
