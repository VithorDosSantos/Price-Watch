import { useEffect, useMemo, useState } from "react";
import { Check, Layers3, PencilLine, Plus, Search, Trash2, X } from "lucide-react";
import { Badge } from "../components/ui/badge";
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
import { Switch } from "../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { createCategory, deleteCategory, listCategories, updateCategory, type CategoryRecord } from "../services/api";
import { toast } from "sonner";

type CategoryFormState = {
  name: string;
  description: string;
  isActive: boolean;
};

const emptyForm: CategoryFormState = {
  name: "",
  description: "",
  isActive: true
};

export function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);

  useEffect(() => {
    void listCategories().then(setCategories);
  }, []);

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [categories, searchQuery]
  );

  function openCreateDialog() {
    setEditingCategory(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEditDialog(category: CategoryRecord) {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description,
      isActive: category.isActive
    });
    setOpen(true);
  }

  async function handleSubmit() {
    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, form);
        setCategories((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        toast.success("Categoria atualizada com sucesso!");
      } else {
        const created = await createCategory(form);
        setCategories((current) => [created, ...current]);
        toast.success("Categoria criada com sucesso!");
      }

      setOpen(false);
      setEditingCategory(null);
      setForm(emptyForm);
    } catch {
      toast.error("Não foi possível salvar a categoria.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCategory(id);
      setCategories((current) => current.filter((item) => item.id !== id));
      toast.success("Categoria removida com sucesso!");
    } catch {
      toast.error("Não foi possível remover a categoria.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground mt-2">Organize os produtos por tipo para facilitar buscas e filtros.</p>
        </div>

        <Button className="bg-violet-600 hover:bg-violet-700" onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Total cadastradas</p>
          <p className="mt-2 text-3xl font-bold">{categories.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Categorias ativas</p>
          <p className="mt-2 text-3xl font-bold">{categories.filter((category) => category.isActive).length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Categorias inativas</p>
          <p className="mt-2 text-3xl font-bold">{categories.filter((category) => !category.isActive).length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar categoria"
            className="pl-10"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"} className={category.isActive ? "bg-green-600" : ""}>
                      {category.isActive ? (
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
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                        <PencilLine className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => void handleDelete(category.id)}>
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
            <DialogTitle>{editingCategory ? "Editar categoria" : "Nova categoria"}</DialogTitle>
            <DialogDescription>
              Organize o catálogo e mantenha os filtros do sistema bem definidos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="category-name">Nome</Label>
              <Input
                id="category-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Descrição</Label>
              <Input
                id="category-description"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Ativa</p>
                <p className="text-sm text-muted-foreground">Define se a categoria aparece nas telas de busca.</p>
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