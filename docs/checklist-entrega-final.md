# Checklist Final de Entrega - PriceWatch

Data de validacao: 2026-06-02

## 1) Requisitos academicos principais

- [x] Front-end interativo implementado.
- [x] Back-end com regras de negocio implementado.
- [x] Persistencia em banco relacional via Prisma/PostgreSQL.
- [x] Integracao com API externa (SerpApi).
- [x] Minimo de 5 areas com CRUD atendido.
- [x] Minimo de 15 casos de uso atendido (UC01 a UC15).

## 2) Casos de uso (UC01-UC15)

- [x] UC01 - Pesquisar Produtos
- [x] UC02 - Visualizar Produtos em Destaque
- [x] UC03 - Visualizar Detalhes de Produto
- [x] UC04 - Consultar Historico de Preco
- [x] UC05 - Comparar Precos entre Lojas
- [x] UC06 - Cadastrar Produto no Sistema
- [x] UC07 - Atualizar Produto
- [x] UC08 - Remover Produto
- [x] UC09 - Favoritar Produto
- [x] UC10 - Listar Favoritos
- [x] UC11 - Remover Favorito
- [x] UC12 - Criar Alerta de Preco
- [x] UC13 - Listar Alertas de Preco
- [x] UC14 - Atualizar Alerta de Preco
- [x] UC15 - Remover Alerta de Preco

## 3) CRUDs obrigatorios (>= 5)

- [x] Produtos (administrativo)
- [x] Lojas
- [x] Categorias
- [x] Historico de precos (cadastro administrativo)
- [x] Alertas de preco

## 4) Evidencias de testes executadas

### Backend

Comando:

```bash
npm --prefix backend test
```

Ultimo resultado validado:

- 22 arquivos de teste aprovados
- 162 testes aprovados

### Frontend unitario

Comando:

```bash
npm --prefix frontend test
```

Ultimo resultado validado:

- 26 arquivos de teste aprovados
- 139 testes aprovados

### Frontend E2E

Comando:

```bash
npm --prefix frontend run test:e2e
```

Ultimo resultado validado:

- 2 testes E2E aprovados

## 5) Seguranca de dependencias

- [x] Auditoria de producao sem vulnerabilidades:
  - `npm --prefix backend audit --omit=dev` -> 0 vulnerabilidades
  - `npm --prefix frontend audit --omit=dev` -> 0 vulnerabilidades
- [ ] Dependencias de desenvolvimento ainda reportam vulnerabilidades em cadeia Vitest/Vite (`npm audit` sem `--omit=dev`).

Observacao:

- Foi aplicado ajuste nao-breaking no backend (`npm audit fix`) e mantida a combinacao de dependencias estavel para preservar a execucao integral das suites.

## 6) Estado final para entrega

- [x] Sistema funcional para escopo proposto.
- [x] Casos de uso e CRUDs coerentes com documentacao.
- [x] Testes de API, unitarios de interface e E2E executados com sucesso.
- [x] Evidencias consolidadas em documento de checklist final.
