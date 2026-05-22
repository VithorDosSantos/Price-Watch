import React, { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../services/api";
import { toast } from "sonner";
import { Button } from "../components/ui/button";

export function AdminUsersPage() {
  const [users, setUsers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.users);
    } catch (err) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function changeRole(id: string, role: "ADMIN" | "USER") {
    try {
      const res = await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? res.user : u)));
      toast.success("Perfil atualizado");
    } catch (err) {
      toast.error("Erro ao atualizar");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left">
              <th className="p-2">Email</th>
              <th className="p-2">Nome</th>
              <th className="p-2">Papel</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.name ?? "-"}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  {u.role !== "ADMIN" ? (
                    <Button onClick={() => changeRole(u.id, "ADMIN")} className="mr-2">Tornar admin</Button>
                  ) : (
                    <Button onClick={() => changeRole(u.id, "USER")} variant="destructive">Revogar admin</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
