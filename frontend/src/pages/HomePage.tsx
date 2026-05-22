import { Bell, Search, Shield, TrendingUp } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard, type ProductCardProps } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { searchProducts, listFavorites, type Product } from "../services/api";

function mapApiProductToCard(product: Product): ProductCardProps {
  return {
    id: product.id,
    name: product.name,
    image: product.imageUrl ?? "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    currentPrice: Number(product.price),
    originalPrice: Math.round(Number(product.price) * 1.12),
    store: product.storeName ?? "Mercado Livre",
    priceChange: -8.5,
    isFavorite: false
  };
}

export function HomePage() {
  const [query, setQuery] = useState("notebook");
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [feedback, setFeedback] = useState("Digite um produto para começar a busca.");
  const resultsRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    setFeedback("Buscando preços reais no Mercado Livre...");

    const result = await searchProducts(query);
    const favorites = (await listFavorites()).map((f) => f.product.id);
    setProducts(result.products.map((p) => ({ ...mapApiProductToCard(p), isFavorite: favorites.includes(p.id) })));
    setFeedback(result.products.length > 0 ? `${result.products.length} resultado(s) encontrado(s).` : "Nenhum produto encontrado para essa busca.");
    setIsLoading(false);

    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  async function loadShowcase() {
    setIsLoading(true);
    try {
      const result = await searchProducts(query);
      const favorites = (await listFavorites()).map((f) => f.product.id);
      setProducts(result.products.map((p) => ({ ...mapApiProductToCard(p), isFavorite: favorites.includes(p.id) })));
      setHasSearched(false);
      setFeedback("Sugestões carregadas para você explorar.");
    } catch (err) {
      setFeedback("Não foi possível carregar os resultados agora. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="container px-4 lg:px-8 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
            Monitore preços e
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              economize dinheiro
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground">
            Pesquise um produto, abra os detalhes e salve o que quiser acompanhar depois.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Digite o nome do produto ou cole o link da loja"
              className="h-14 pl-12 pr-28 text-base shadow-lg border-gray-200"
            />
            <Button
              type="submit"
              size="lg"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-700"
              disabled={isLoading}
            >
              {isLoading ? "Buscando" : "Pesquisar"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground">{feedback}</p>
        </div>
      </section>

      <section ref={resultsRef} className="container scroll-mt-20 px-4 lg:px-8 pb-16">
        <div className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {hasSearched ? "Resultados da busca" : "Comece sua busca"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {hasSearched
                  ? `Resultados para "${query}" exibidos abaixo.`
                  : "Digite um termo para ver produtos reais do Mercado Livre."}
              </p>
            </div>
            <Button variant="outline" onClick={() => void loadShowcase()}>
              Ver sugestões
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} isFavorite={product.isFavorite} />
            ))}
          </div>
        </div>
      </section>

      <section className="container px-4 lg:px-8 py-16 border-y bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
              <TrendingUp className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="font-semibold">Histórico</h3>
            <p className="text-sm text-muted-foreground">
              Veja como o preço mudou ao longo do tempo.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
              <Bell className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="font-semibold">Alertas</h3>
            <p className="text-sm text-muted-foreground">
              Receba um aviso quando o preço chegar ao valor que você definiu.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
              <Shield className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="font-semibold">100% Gratuito</h3>
            <p className="text-sm text-muted-foreground">Acompanhe quantos produtos quiser sem custo.</p>
          </div>
        </div>
      </section>

      <section className="container px-4 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Pronto para economizar?</h2>
          <p className="text-lg text-violet-100 mb-8 max-w-2xl mx-auto">
            Comece agora e acompanhe os produtos que mais importam para você.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-violet-600 hover:bg-gray-100" onClick={() => navigate("/alerts")}>
            Criar meu alerta
          </Button>
        </div>
      </section>
    </div>
  );
}
