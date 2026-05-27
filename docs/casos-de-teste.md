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

## Casos Pendentes

- Testar autenticacao local: registro, login e `/auth/me`.
- Testar protecao de rotas administrativas com JWT.
- Testar CRUD de lojas por API com usuario administrador.
- Testar CRUD de historico de precos por API com usuario administrador.
- Testar integracao de produtos com fallback da API do Mercado Livre.
