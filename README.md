# PriceWatch

PriceWatch é um sistema web para monitoramento de preços com front-end em React, back-end em Express e banco PostgreSQL com Prisma. A busca de produtos usa SerpApi Google Shopping e os resultados retornados são persistidos no banco local para manter detalhes, favoritos e alertas funcionando no fluxo atual.

## Stack

- Front-end: React, TypeScript, Vite, Tailwind CSS
- Back-end: Node.js, Express, TypeScript
- Banco: PostgreSQL
- ORM: Prisma
- Busca externa: SerpApi Google Shopping

## Estrutura

```text
Price-Watch/
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
└── README.md
```

## Variáveis de Ambiente

Backend em [backend/.env.example](backend/.env.example):

```text
DATABASE_URL="postgresql://pricewatch:pricewatch@localhost:5433/pricewatch?schema=public"
PORT=3333
JWT_SECRET="troque_por_uma_chave_segura"
SERPAPI_API_KEY=""
```

Frontend em [frontend/.env.example](frontend/.env.example):

```text
VITE_API_URL=http://localhost:3333
```

## Como Rodar Localmente

### Banco

1. Suba o PostgreSQL com `docker compose up -d`.
2. No back-end, rode `npm install`.
3. Aplique o schema com `npm run db:push` ou `npm run prisma:migrate`.

### Back-end

```bash
cd backend
npm install
npm run dev
```

### Front-end

```bash
cd frontend
npm install
npm run dev
```

## Rotas Principais

- `GET /health`
- `GET /products/search?q=termo`
- `GET /products/showcase`
- `GET /products/:id`
- `GET /products/:id/history`
- `GET /products/:id/offers`
- `POST /products` (ADMIN)
- `PUT /products/:id` (ADMIN)
- `DELETE /products/:id` (ADMIN)
- `POST /favorites`
- `GET /favorites`
- `POST /alerts`
- `GET /alerts`
- `POST /auth/register`
- `POST /auth/login/local`
- `GET /auth/me`
- `PATCH /auth/me`
- `DELETE /auth/me`

## Busca de Produtos

A busca consulta a SerpApi com `engine=google_shopping`, `gl=br` e `hl=pt-BR`. O back-end converte `shopping_results` para o formato interno do PriceWatch, salva os produtos retornados no banco e responde à interface com os dados prontos para uso.

## Documentação

- [Escopo](docs/escopo.md)
- [Casos de uso](docs/casos-de-uso.md)
- [Casos de teste](docs/casos-de-teste.md)
- [API externa](docs/api-externa.md)
- [Modelagem de banco](docs/modelagem-banco.md)

## Observações

- A busca externa agora usa SerpApi e o perfil do usuário ficou restrito à conta local.
- O perfil do usuário ficou restrito a gestão da conta local.
- A interface foi mantida responsiva para desktop e mobile.