# API Externa: Mercado Livre

## API Escolhida

A API externa escolhida para a Sprint 1 foi a API pública do Mercado Livre.

Endpoint principal usado:

```http
GET https://api.mercadolibre.com/sites/MLB/search?q=termo
```

## Justificativa

O Mercado Livre foi escolhido porque possui grande volume de produtos no mercado brasileiro, fornece dados reais e permite consultas públicas de busca sem autenticação para o escopo inicial do projeto.

## Dados Utilizados

A integração inicial usa os seguintes campos:

- `id`: identificador externo do produto.
- `title`: nome do produto.
- `price`: preço atual.
- `thumbnail`: imagem do produto.
- `permalink`: link público do produto.
- `seller.nickname`: loja ou vendedor.
- `category_id`: categoria informada pela plataforma.

## Estratégia de Fallback

Para garantir que a Sprint 1 continue apresentável mesmo sem internet ou com instabilidade na API externa, o back-end retorna produtos mockados quando:

- A API do Mercado Livre falha.
- A API retorna erro HTTP.
- A busca não retorna resultados.

## Limitações Conhecidas

- Os preços representam o momento da consulta.
- A categoria pode vir como identificador da plataforma.
- Não há autenticação OAuth nesta sprint.
- O histórico de preços ainda não é coletado automaticamente.

## Evoluções Futuras

- Consultar detalhes completos do produto.
- Normalizar categorias.
- Criar rotina periódica de captura de preço.
- Persistir variações em `PriceHistory`.
- Aplicar regras de alerta sobre preços capturados.
