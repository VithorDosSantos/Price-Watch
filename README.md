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
- Ambiente local de banco: PostgreSQL local e PgAdmin

## Justificativa da Stack

- React + Vite: permite criar um protótipo navegável com rapidez, boa organização de componentes e experiência moderna de desenvolvimento.
- TypeScript: aumenta a segurança do código e reduz erros comuns entre front-end, back-end e modelos de dados.
- TailwindCSS: facilita a criação de uma interface responsiva, limpa e consistente.
- Node.js + Express: oferece uma API REST simples, didática e suficiente para a Sprint 1.
- PostgreSQL: banco relacional robusto, adequado para produtos, favoritos, alertas e histórico de preços.
- Prisma: ORM tipado que organiza a modelagem do banco e facilita a evolução com migrations.
- Mercado Livre API: fornece dados reais de produtos no contexto brasileiro e possui endpoints públicos para busca.
- PostgreSQL local + PgAdmin: permitem administrar o banco diretamente na máquina.

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

## Como Rodar o Banco Localmente

O PgAdmin é apenas a ferramenta de administração. O banco em si precisa ser um PostgreSQL instalado na sua máquina, ou em outro servidor local acessível pela rede.

No PgAdmin, adicione um novo servidor com os dados abaixo:

```text
nome: PriceWatch Local
host: localhost
port: 5432
database: PriceWatch
user: postgres
password: Murilo2006$
```

Se o PostgreSQL estiver em outra máquina da rede, troque `localhost` pelo IP dessa máquina e mantenha a porta configurada no servidor.

No backend, o arquivo `.env` já aponta para:

```text
DATABASE_URL=postgresql://postgres:Murilo2006$@localhost:5432/PriceWatch?schema=public
```

Se o seu PostgreSQL usar outra porta, ajuste esse valor no `.env` e no `.env.example`.

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
psql -h localhost -p 5432 -U pricewatch -d pricewatch -f .\backend\prisma\init.sql
```

Se o comando `psql` não estiver disponível no seu sistema, instale o cliente do PostgreSQL ou use a aba de query do próprio PgAdmin para executar o conteúdo de `backend/prisma/init.sql`.

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

Se ainda não tiver instalado as dependências, rode primeiro:

```bash
npm install
```

## Como Rodar os Testes do Back-end

Dentro de `backend/`:

```bash
npm test
```

Tambem e possivel executar por camada:

```bash
npm run test:unit
npm run test:integration
```

Os casos de teste documentados ficam em `docs/casos-de-teste.md`.

## Deploy do Back-end com Docker no Render

O back-end possui um `Dockerfile` em `backend/Dockerfile` e uma pipeline em `.github/workflows/deploy-backend-docker.yml`.

No Render, configure o serviço como Docker:

```text
Runtime: Docker
Root Directory: backend
Dockerfile Path: ./Dockerfile
```

Configure as variáveis de ambiente no Render:

```text
DATABASE_URL=sua_url_do_postgres_render
MERCADO_LIVRE_API_URL=https://api.mercadolibre.com
MERCADO_LIVRE_CLIENT_ID=seu_app_id
MERCADO_LIVRE_CLIENT_SECRET=sua_secret_key
MERCADO_LIVRE_REDIRECT_URI=https://price-watch-0uez.onrender.com/auth/callback
```

Importante: no Render, o `DATABASE_URL` precisa apontar para o PostgreSQL do próprio Render, usando a string de conexão do serviço. Não use `localhost:5433` em produção, porque o container do Render não enxerga o seu banco local.

Para a pipeline disparar deploy automático, crie um Deploy Hook no Render e salve a URL no GitHub em:

```text
Settings > Secrets and variables > Actions > New repository secret
Name: RENDER_DEPLOY_HOOK_URL
Value: URL do Deploy Hook do Render
```

Depois de configurar, cada push na branch `main` que alterar o back-end fará o build da imagem Docker e chamará o deploy no Render.

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

Se ainda não tiver instalado as dependências, rode primeiro:

```bash
npm install
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

A busca consulta a API do Mercado Livre em tempo real. Para funcionar corretamente, o backend precisa estar autenticado com um token válido do Mercado Livre. Se a integração não estiver configurada, a API retorna erro explícito em vez de dados simulados.

No front, a conexão pode ser iniciada pela página de perfil, no bloco "Mercado Livre".

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

## Integração com Token do Mercado Livre

O back-end usa OAuth 2.0 no fluxo server side para obter, salvar e renovar o token do Mercado Livre automaticamente.

### Como conseguir o token na prática

1. Crie um aplicativo no painel do Mercado Livre Developer Center.
2. Copie o `APP ID` e o `CLIENT SECRET` gerados para o aplicativo.
3. Configure a `redirect_uri` exatamente como o ambiente que você está usando.
  O painel do Mercado Livre exige HTTPS, então `http://localhost` não é aceito.

```text
Render: https://price-watch-0uez.onrender.com/auth/callback
Tunnel HTTPS local: https://seu-tunel-publico/auth/callback
```

4. Preencha no arquivo `backend/.env` com a URL correspondente ao ambiente em execução:

```text
MERCADO_LIVRE_CLIENT_ID=seu_app_id
MERCADO_LIVRE_CLIENT_SECRET=sua_secret_key
MERCADO_LIVRE_REDIRECT_URI=https://price-watch-0uez.onrender.com/auth/callback
```

Se você for testar em um backend local, primeiro crie um túnel HTTPS (por exemplo com ngrok, Cloudflare Tunnel ou similar) e use a URL pública gerada:

```text
MERCADO_LIVRE_REDIRECT_URI=https://seu-tunel-publico/auth/callback
```

5. Inicie o backend com `npm run dev`.
6. Abra no navegador a rota:

```text
https://price-watch-0uez.onrender.com/auth/login
```

ou pegue a URL pronta em:

```text
https://price-watch-0uez.onrender.com/auth/login/url
```

Se a URL gerada ainda mostrar `http://localhost`, significa que você está consultando o backend local. Nesse caso, o Mercado Livre só vai aceitar o fluxo se você usar um túnel HTTPS apontando para o backend local ou se rodar o fluxo publicado no Render.

7. Faça login com uma conta de vendedor/usuário principal do Mercado Livre e autorize o aplicativo.
8. O Mercado Livre vai redirecionar para `/auth/callback?code=...`.
9. O back-end troca esse `code` por `access_token` e `refresh_token` e salva tudo no banco.
10. Quando o token expirar, o back-end tenta renovar automaticamente usando o `refresh_token` salvo.

### Rotas principais do fluxo

Rotas principais:

```http
GET /auth/login
GET /auth/callback
GET /auth/mercadolivre/status
```

### Como conferir se funcionou

Depois da autorização, verifique o status do token em:

```text
http://localhost:3333/auth/mercadolivre/status
```

Se o token estiver salvo corretamente, a resposta mostra `configured: true`.

### Se continuar dando 403

Confira estes pontos:

1. A `redirect_uri` no painel do Mercado Livre precisa ser idêntica à do `.env`.
2. O login precisa ser feito com a conta principal do vendedor, não com operador/colaborador.
3. O aplicativo precisa ter grant/autorização na conta.
4. Se o app estiver usando `refresh_token` antigo, gere um novo fluxo de autorização.
5. A chamada pública de busca pode continuar retornando 403 enquanto o token não existir ou estiver inválido.

Depois do deploy, configure no Render:

```text
MERCADO_LIVRE_CLIENT_ID=seu_app_id
MERCADO_LIVRE_CLIENT_SECRET=sua_secret_key
MERCADO_LIVRE_REDIRECT_URI=https://price-watch-0uez.onrender.com/auth/callback
```

Abra esta URL para autorizar a aplicação:

```text
https://price-watch-0uez.onrender.com/auth/login
```

Quando o Mercado Livre redirecionar para `/auth/callback`, o back-end salva o `access_token`, `refresh_token` e expiração no banco. A busca de produtos passa a usar o token salvo e renova automaticamente quando o token expira.

Para verificar se o token está salvo:

```text
https://price-watch-0uez.onrender.com/auth/mercadolivre/status
```

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
