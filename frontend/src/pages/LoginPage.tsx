import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { loginUser } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await loginUser(email, password);
      loginWithToken(res.token, res.user);
      toast.success("Login realizado");
      navigate("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao efetuar login");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-slate-900 p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.45),_transparent_35%)]" />
          <div className="relative space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-200">PriceWatch</p>
            <h1 className="max-w-md text-4xl font-semibold leading-tight">
              Entre para monitorar preços reais e salvar seus favoritos.
            </h1>
            <p className="max-w-md text-sm leading-6 text-violet-100/90">
              Acesse sua conta para buscar produtos, salvar favoritos e criar alertas de preço.
            </p>
          </div>
          <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-violet-100">Dica</p>
            <p className="mt-2 text-sm text-white/90">
              Se você for o primeiro usuário criado, ele vira administrador automaticamente.
            </p>
          </div>
        </div>

        <div className="flex items-center p-6 sm:p-8 lg:p-10">
          <div className="w-full space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
                Acesso
              </p>
              <h2 className="text-3xl font-bold tracking-tight">Entrar na conta</h2>
              <p className="text-sm text-muted-foreground">Use seu email e senha para continuar.</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-300 bg-gray-50/70 focus-visible:ring-violet-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="login-password" className="text-sm font-medium text-slate-700">
                    Senha
                  </label>
                  <a
                    href="/register"
                    className="text-sm font-medium text-violet-600 hover:text-violet-700"
                  >
                    Criar conta
                  </a>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-gray-300 bg-gray-50/70 focus-visible:ring-violet-500"
                />
              </div>

              <Button
                type="submit"
                className="h-12 w-full bg-violet-600 font-semibold hover:bg-violet-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              Ainda não tem conta?{" "}
              <a href="/register" className="font-medium text-violet-600 hover:text-violet-700">
                Cadastre-se agora
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
