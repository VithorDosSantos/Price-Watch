# 📊 Qualidade de Código - Relatórios e Configurações

Este documento descreve os requisitos de qualidade de código implementados no projeto Price-Watch.

## 📈 Cobertura de Código

### Meta: 70–80%

Ambos backend e frontend estão configurados com a meta mínima de **70%** de cobertura de código em:
- **Lines**: Linhas executadas
- **Functions**: Funções testadas
- **Branches**: Ramificações de código (if/else, etc.)
- **Statements**: Declarações de código

### Executar testes com cobertura

**Backend:**
```bash
cd backend
npm run coverage
# Relatório HTML: backend/coverage/index.html
```

**Frontend:**
```bash
cd frontend
npm run coverage
# Relatório HTML: frontend/coverage/index.html
```

## 🔍 Análise Estática de Qualidade

### ESLint + Prettier
Ambos backend e frontend possuem configurações de:
- **ESLint**: Verifica padrões de código, tipos, boas práticas
- **Prettier**: Garante formatação consistente

### SonarCloud (Análise Avançada)
Análise contínua de qualidade de código na nuvem:
- 🐛 Detecção de bugs
- 🔒 Vulnerabilidades de segurança
- 💾 Duplicação de código
- 📊 Métricas detalhadas
- 🔗 Integração automática com GitHub PRs

**Setup:** Veja `SONARCLOUD-QUICKSTART.md` (5 minutos)

### Executar análise estática

**Backend:**
```bash
# Verificar problemas
npm run lint

# Corrigir automaticamente
npm run lint:fix

# Formatar código
npm run format
```

**Frontend:**
```bash
# Verificar problemas
npm run lint

# Corrigir automaticamente
npm run lint:fix

# Verificar formatação
npm run format:check

# Formatar código
npm run format
```

## 🔐 CI/CD Integration

### Backend
- Workflow: `.github/workflows/deploy-backend-docker.yml`
- ✅ Executa testes antes de build
- ✅ Valida cobertura (mínimo 70%)
- ✅ Executa ESLint
- ✅ **Análise SonarCloud automática**
- 📤 Upload de artefatos: `backend-coverage-report`

### Frontend
- Workflow: `.github/workflows/frontend-quality.yml`
- ✅ Executa testes unitários com cobertura
- ✅ Valida cobertura (mínimo 70%)
- ✅ Executa ESLint
- ✅ Valida formatação com Prettier
- ✅ Executa testes E2E (Playwright)
- ✅ **Análise SonarCloud automática**
- 📤 Upload de artefatos: `frontend-coverage-report`, `frontend-e2e-results`

### SonarCloud Dashboard
- Backend: https://sonarcloud.io/dashboard?id=pricewatch-backend
- Frontend: https://sonarcloud.io/dashboard?id=pricewatch-frontend

## 📁 Configuração de Arquivos

### Backend
- `.eslintrc.json`: Regras ESLint para Node.js/TypeScript
- `.prettierrc.json`: Configuração de formatação
- `vitest.config.ts`: Configuração de cobertura (70%)
- `package.json`: Scripts de teste e linting

### Frontend
- `.eslintrc.json`: Regras ESLint para React/TypeScript
- `.prettierrc.json`: Configuração de formatação
- `vitest.config.ts`: Configuração de cobertura (70%) com jsdom
- `tests/setup.ts`: Configuração de ambiente para testes
- `package.json`: Scripts de teste, linting e coverage

## 🚀 Scripts Disponíveis

### Backend

```bash
npm run test              # Executar testes (sem cobertura)
npm run test:unit        # Testes unitários
npm run test:integration # Testes de integração
npm run test:watch       # Modo watch para desenvolvimento
npm run coverage         # Testes com relatório de cobertura
npm run lint            # Verificar código
npm run lint:fix        # Corrigir lint automaticamente
npm run format          # Formatar código
npm run format:check    # Verificar formatação
```

### Frontend

```bash
npm run test            # Testes unitários
npm run test:watch      # Modo watch para desenvolvimento
npm run test:ui         # Interface visual dos testes
npm run coverage        # Testes com relatório de cobertura
npm run test:e2e        # Testes end-to-end
npm run test:e2e:ui     # E2E com interface visual
npm run lint            # Verificar código
npm run lint:fix        # Corrigir lint automaticamente
npm run format          # Formatar código
npm run format:check    # Verificar formatação
```

## 📊 Interpretando Relatórios

Após executar `npm run coverage`, acesse:
- **Backend**: `backend/coverage/index.html`
- **Frontend**: `frontend/coverage/index.html`

### Métricas

| Métrica | Descrição |
|---------|-----------|
| **Lines** | % de linhas de código executadas |
| **Functions** | % de funções testadas |
| **Branches** | % de ramificações de código (condições) |
| **Statements** | % de declarações executadas |

**Status:**
- 🟢 **Verde** (>= 80%): Excelente
- 🟡 **Amarelo** (70-79%): Aceitável
- 🔴 **Vermelho** (< 70%): Abaixo da meta

## 🔄 Workflow de Desenvolvimento

1. **Escrever código**
2. **Executar testes**: `npm run test:watch`
3. **Verificar cobertura**: `npm run coverage`
4. **Formatar código**: `npm run format`
5. **Validar lint**: `npm run lint:fix`
6. **Fazer commit**: Git passa por CI/CD automaticamente

## 🎯 Metas do Projeto

- ✅ **Cobertura mínima**: 70%
- ✅ **Cobertura alvo**: 70–80%
- ✅ **Zero erros de lint**: CI/CD falha se houver erros
- ✅ **Formatação consistente**: Prettier enforce
- ✅ **Testes antes de merge**: PR requer sucesso em CI/CD

## 📝 Notas

- Configuração de Node engines: v20.17.0 (atualmente instalado)
- Alguns pacotes têm avisos de engine (v20.19.0+), mas funcionam normalmente
- ESLint e Prettier estão configurados para trabalhar juntos (sem conflitos)
- Cobertura exclui arquivos `.d.ts`, `index.ts` e setup files automaticamente
