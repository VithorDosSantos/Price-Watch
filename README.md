# PriceWatch

PriceWatch é um sistema web acadêmico para monitoramento de preços de produtos. A proposta é permitir que o usuário pesquise produtos, visualize preço atual, favorite itens, crie alertas de preço e acompanhe um dashboard simples com produtos monitorados.

## Objetivo da Sprint 1

Criar um esqueleto funcional e apresentável de front-end e back-end, com estrutura profissional de repositório, documentação inicial, modelagem de banco com Prisma e integração identificada com uma API externa.

## Tema do Projeto

O tema escolhido foi monitoramento de preços de produtos. Esse tema permite demonstrar operações comuns em sistemas web, como consulta de dados externos, cadastro de favoritos, criação de alertas, persistência em banco relacional e apresentação de informações em dashboard.

## Tecnologias Usadas

- Front-end: React, TypeScript, Vite e TailwindCSS
- Back-end: Node.js, Express e TypeScript
- Banco de dados: PostgreSQL
- ORM: Prisma
- API externa: Mercado Livre API
- Gerenciador de pacotes: npm
- Ambiente local de banco: Docker Compose

## Justificativa da Stack

- React + Vite: permite criar um protótipo navegável com rapidez, boa organização de componentes e experiência moderna de desenvolvimento.
- TypeScript: aumenta a segurança do código e reduz erros comuns entre front-end, back-end e modelos de dados.
- TailwindCSS: facilita a criação de uma interface responsiva, limpa e consistente.
- Node.js + Express: oferece uma API REST simples, didática e suficiente para a Sprint 1.
- PostgreSQL: banco relacional robusto, adequado para produtos, favoritos, alertas e histórico de preços.
- Prisma: ORM tipado que organiza a modelagem do banco e facilita a evolução com migrations.
- Mercado Livre API: fornece dados reais de produtos no contexto brasileiro e possui endpoints públicos para busca.
- Docker Compose: simplifica a execução local do PostgreSQL.

## Estrutura de Pastas

```text
pricewatch/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── prisma/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── init.sql
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── .env.example
│   └── index.html
├── docs/
│   ├── escopo.md
│   ├── casos-de-uso.md
│   ├── modelagem-banco.md
│   └── api-externa.md
├── README.md
└── docker-compose.yml
```

## Como Rodar o Banco com Docker

Na pasta `pricewatch/`, execute:

```bash
docker compose up -d
```

O PostgreSQL ficará disponível em:

```text
localhost:5433
database: pricewatch
user: pricewatch
password: pricewatch
```

A porta `5433` foi usada para evitar conflito com instalações locais de PostgreSQL na porta `5432`.

## Como Instalar o Back-end

Entre na pasta do back-end:

```bash
cd backend
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Como Criar as Tabelas do Banco

Com o PostgreSQL ativo e o `.env` configurado, a opção principal é usar Prisma:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Caso o Prisma Migrate apresente problema no ambiente local, use o SQL de fallback:

```powershell
docker cp ".\backend\prisma\init.sql" pricewatch-postgres:/tmp/init.sql
docker exec pricewatch-postgres psql -U pricewatch -d pricewatch -f /tmp/init.sql
```

Para abrir o Prisma Studio:

```bash
npm run prisma:studio
```

## Como Iniciar o Back-end

Dentro de `backend/`:

```bash
npm run dev
```

API local:

```text
http://localhost:3333
```

## Como Instalar o Front-end

Entre na pasta do front-end:

```bash
cd frontend
npm install
```

## Como Iniciar o Front-end

Dentro de `frontend/`:

```bash
npm run dev
```

Aplicação local:

```text
http://localhost:5173
```

Caso necessário, configure a URL da API com:

```text
VITE_API_URL=http://localhost:3333
```

## Rotas Disponíveis

### Saúde

```http
GET /health
```

Retorna o status online da API.

### Produtos

```http
GET /products/search?q=notebook
GET /products/:id
```

A busca tenta consultar a API do Mercado Livre. Se a API falhar, o sistema retorna produtos mockados.

### Favoritos

```http
POST /favorites
GET /favorites
```

Exemplo de corpo para criar favorito:

```json
{
  "productId": "MLB123",
  "userName": "Aluno PriceWatch"
}
```

### Alertas

```http
POST /alerts
GET /alerts
```

Exemplo de corpo para criar alerta:

```json
{
  "productId": "MLB123",
  "targetPrice": 2500,
  "email": "aluno@pricewatch.com"
}
```

## API Externa Utilizada

O projeto usa a API pública do Mercado Livre:

```http
GET https://api.mercadolibre.com/sites/MLB/search?q=termo
```

Ela foi escolhida por ter dados reais de produtos do mercado brasileiro, permitir busca sem autenticação para endpoints públicos e fornecer informações úteis como nome, preço, imagem, link e vendedor.

## Funcionalidades Entregues na Sprint 1

- Estrutura profissional de repositório.
- Front-end React com layout responsivo baseado no protótipo do Figma.
- Página inicial com busca integrada à rota `GET /products/search`.
- Cards de produto com imagem, preço e botão de detalhes.
- Página de detalhes do produto.
- Página de favoritos.
- Página de dashboard com produtos monitorados.
- Página de alertas de preço.
- Back-end Express com rotas REST.
- Services separados para produtos, favoritos e alertas.
- Integração inicial com Mercado Livre API.
- Fallback para dados mockados.
- Modelagem Prisma com `Product`, `PriceHistory`, `Favorite` e `PriceAlert`.
- Docker Compose para PostgreSQL.
- Documentação de escopo, casos de uso, banco e API externa.

## Observações

- Não há login nesta sprint.
- Não há envio real de e-mail.
- Os gráficos ainda usam dados simulados.
- Dados mockados são usados quando a API local ou externa não está disponível.
