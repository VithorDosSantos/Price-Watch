# Casos de Teste

Este documento registra o inicio da suite de testes do PriceWatch, cobrindo testes unitarios e parte dos testes de integracao exigidos para a entrega.

## Estrategia

- Testes unitarios: validar regras de negocio dos services, entradas invalidas, normalizacao de dados e retorno esperado.
- Testes de integracao: validar rotas HTTP principais da API Express com Supertest.
- Banco de dados: nesta etapa, os testes usam mocks do Prisma para evitar depender de um PostgreSQL ativo durante a execucao automatizada.
- Ferramentas: Vitest e Supertest.

## CT01 - Listar Categorias

- Tipo: Unitario
- Arquivo automatizado: `backend/tests/unit/categoryService.test.ts`
- Objetivo: garantir que `listCategories` consulta o Prisma e devolve datas em formato ISO.
- Massa de teste: uma categoria ativa chamada `Eletronicos`.
- Resultado esperado: lista com uma categoria e campo `createdAt` serializado.
- Status: Automatizado.

## CT02 - Validar Nome Obrigatorio de Categoria

- Tipo: Unitario
- Arquivo automatizado: `backend/tests/unit/categoryService.test.ts`
- Objetivo: impedir cadastro de categoria sem nome.
- Passos:
  1. Chamar `createCategory` com nome vazio.
  2. Verificar erro de validacao.
- Resultado esperado: erro contendo `Nome da categoria`.
- Status: Automatizado.

## CT03 - Criar Categoria com Dados Normalizados

- Tipo: Unitario
- Arquivo automatizado: `backend/tests/unit/categoryService.test.ts`
- Objetivo: garantir que nome e descricao sao salvos sem espacos extras.
- Resultado esperado: Prisma recebe `name` e `description` com `trim`.
- Status: Automatizado.

## CT04 - Atualizar Categoria

- Tipo: Unitario
- Arquivo automatizado: `backend/tests/unit/categoryService.test.ts`
- Objetivo: validar atualizacao de categoria existente e retorno `null` quando o registro nao existe.
- Resultado esperado: categoria atualizada quando existe; `null` quando o Prisma sinaliza erro.
- Status: Automatizado.

## CT05 - Listar Lojas

- Tipo: Unitario
- Arquivo automatizado: `backend/tests/unit/storeService.test.ts`
- Objetivo: garantir que `listStores` consulta o Prisma e devolve os campos esperados.
- Resultado esperado: lista com loja, website e status.
- Status: Automatizado.

## CT06 - Validar Cadastro de Loja

- Tipo: Unitario
- Arquivo automatizado: `backend/tests/unit/storeService.test.ts`
- Objetivo: impedir cadastro de loja sem nome ou website.
- Resultado esperado: erro de validacao para nome vazio e para website vazio.
- Status: Automatizado.

## CT07 - Criar Loja com Dados Normalizados

- Tipo: Unitario
- Arquivo automatizado: `backend/tests/unit/storeService.test.ts`
- Objetivo: garantir que nome, website e contato sao salvos sem espacos extras.
- Resultado esperado: Prisma recebe campos normalizados e `isActive` padrao como `true`.
- Status: Automatizado.

## CT08 - Health Check da API

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/app.test.ts`
- Objetivo: validar que a API Express responde `GET /health`.
- Resultado esperado: HTTP 200 com `status: online` e `service: PriceWatch API`.
- Status: Automatizado.

## CT09 - Listar Categorias pela API

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/categoryRoutes.test.ts`
- Objetivo: validar a integracao entre rota HTTP, controller e service de categorias.
- Resultado esperado: HTTP 200 com array de categorias.
- Status: Automatizado.

## CT10 - Favoritos exigem autenticacao

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/favoriteRoutes.test.ts`
- Objetivo: impedir acesso a favoritos sem token JWT.
- Resultado esperado: HTTP 401.
- Status: Automatizado.

## CT11 - Listar Favoritos por Usuario

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/favoriteRoutes.test.ts`
- Objetivo: garantir que apenas favoritos do usuario autenticado sejam retornados.
- Resultado esperado: HTTP 200 com lista apenas do usuario.
- Status: Automatizado.

## CT12 - Criar Favorito por Usuario

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/favoriteRoutes.test.ts`
- Objetivo: criar favorito associado ao usuario autenticado.
- Resultado esperado: HTTP 201 com objeto favorito.
- Status: Automatizado.

## CT13 - Alertas exigem autenticacao

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/alertRoutes.test.ts`
- Objetivo: impedir acesso a alertas sem token JWT.
- Resultado esperado: HTTP 401.
- Status: Automatizado.

## CT14 - Criar Alerta por Usuario

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/alertRoutes.test.ts`
- Objetivo: criar alerta associado ao usuario autenticado.
- Resultado esperado: HTTP 201 com objeto alerta.
- Status: Automatizado.

## CT15 - Atualizar Alerta por Usuario

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/alertRoutes.test.ts`
- Objetivo: atualizar alerta existente do usuario autenticado.
- Resultado esperado: HTTP 200 com dados atualizados.
- Status: Automatizado.

## CT16 - Remover Alerta por Usuario

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/alertRoutes.test.ts`
- Objetivo: remover alerta do usuario autenticado.
- Resultado esperado: HTTP 204.
- Status: Automatizado.

## CT17 - Autenticacao Local (Login e /auth/me)

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/authRoutes.test.ts`
- Objetivo: validar login e retorno do usuario autenticado.
- Resultado esperado: HTTP 200 com token no login e HTTP 200 no `/auth/me` com token valido.
- Status: Automatizado.

## CT18 - Rotas Admin bloqueiam usuario comum

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/adminRoutes.test.ts`
- Objetivo: garantir que rotas administrativas retornem 403 para usuario sem perfil ADMIN.
- Resultado esperado: HTTP 403 em `/stores`, `/price-history`, `/users` e `/products/:id`.
- Status: Automatizado.

## CT19 - Rotas Admin permitem usuario administrador

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/adminRoutes.test.ts`
- Objetivo: garantir que rotas administrativas aceitam token ADMIN.
- Resultado esperado: HTTP 201/200/204 conforme a rota.
- Status: Automatizado.

## CT20 - Fluxo E2E de conta (registro, login, perfil)

- Tipo: E2E
- Arquivo automatizado: `frontend/tests/e2e/auth-profile.spec.ts`
- Objetivo: validar registro, login, atualizacao de perfil e exclusao de conta.
- Resultado esperado: usuario autenticado, perfil atualizado e exclusao redireciona para cadastro.
- Status: Automatizado.

## CT21 - Rota protegida redireciona para login

- Tipo: E2E
- Arquivo automatizado: `frontend/tests/e2e/auth-profile.spec.ts`
- Objetivo: garantir que `/profile` redireciona usuario nao autenticado para login.
- Resultado esperado: redirecionamento para `/login`.
- Status: Automatizado.

## CT22 - Criar Produto por API com Admin

- Tipo: Integracao
- Arquivo automatizado: `backend/tests/integration/adminRoutes.test.ts`
- Objetivo: garantir que somente ADMIN cria produto manual pela rota `POST /products`.
- Resultado esperado: HTTP 403 para usuario comum e HTTP 201 para ADMIN.
- Status: Automatizado.

## CT23 - Consultar Historico e Ofertas de Produto

- Tipo: Unitario
- Arquivo automatizado: `backend/tests/unit/productController.test.ts`
- Objetivo: validar os controladores `GET /products/:id/history` e `GET /products/:id/offers`.
- Resultado esperado: retorno de dados com limites válidos e tratamento de 404/400.
- Status: Automatizado.

## CT24 - CRUD Administrativo de Produtos na Interface

- Tipo: Unitario (frontend)
- Arquivo automatizado: `frontend/src/pages/AdminProductsPage.test.tsx`
- Objetivo: validar listagem, criação e remoção de produtos na tela administrativa.
- Resultado esperado: carregamento da tabela, submissão de cadastro e exclusão do item.
- Status: Automatizado.

## CT25 - Criacao de Alerta com Selecao de Produto

- Tipo: Unitario (frontend)
- Arquivo automatizado: `frontend/src/pages/AlertsPage.test.tsx`
- Objetivo: validar fluxo de alerta com busca/seleção de produto e manipulação da lista.
- Resultado esperado: a página renderiza e mantém operações de atualização/remoção sem regressão.
- Status: Automatizado.

## Situação Atual

- Suíte unitária e de integração backend executada com sucesso localmente.
- Suíte unitária frontend executada com sucesso localmente.
- E2E configurado com Playwright; execução depende da instalação dos browsers no ambiente (`npx playwright install`).
