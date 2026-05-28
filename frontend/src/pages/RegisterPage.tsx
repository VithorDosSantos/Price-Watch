import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { registerUser } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await registerUser(name || undefined, email, password);
      loginWithToken(res.token, res.user);
      toast.success("Conta criada e logado");
      if (res.isFirstAdmin) {
        navigate("/profile?autoConnect=1");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-900 to-violet-700 p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.42),_transparent_33%)]" />
          <div className="relative space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Comece agora</p>
            <h1 className="max-w-md text-4xl font-semibold leading-tight">
              Crie sua conta e acompanhe quedas de preço sem perder tempo.
            </h1>
            <p className="max-w-md text-sm leading-6 text-violet-100/90">
              Crie sua conta para salvar favoritos, acompanhar preços e usar o painel administrativo quando estiver disponível.
            </p>
          </div>
          <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-violet-100">Segurança</p>
            <p className="mt-2 text-sm text-white/90">
              A primeira conta criada recebe acesso de administrador automaticamente.
            </p>
          </div>
        </div>

        <div className="flex items-center p-6 sm:p-8 lg:p-10">
          <div className="w-full space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Cadastro</p>
              <h2 className="text-3xl font-bold tracking-tight">Criar conta</h2>
              <p className="text-sm text-muted-foreground">Preencha os dados abaixo para começar a usar o PriceWatch.</p>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nome</label>
                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 border-gray-300 bg-gray-50/70 focus-visible:ring-violet-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-300 bg-gray-50/70 focus-visible:ring-violet-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Senha</label>
                  <Input
                    type="password"
                    placeholder="Crie uma senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-gray-300 bg-gray-50/70 focus-visible:ring-violet-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Confirmar senha</label>
                  <Input
                    type="password"
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 border-gray-300 bg-gray-50/70 focus-visible:ring-violet-500"
                  />
                </div>
              </div>

              <Button type="submit" className="h-12 w-full bg-violet-600 font-semibold hover:bg-violet-700" disabled={isSubmitting}>
                {isSubmitting ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              Já tem conta?{' '}
              <a href="/login" className="font-medium text-violet-600 hover:text-violet-700">
                Entrar agora
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
