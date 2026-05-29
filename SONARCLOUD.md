# 🔐 SonarQube / SonarCloud Integration

Este documento explica como integrar SonarCloud com o projeto Price-Watch para análise estática de qualidade de código.

## 📋 O que é SonarCloud?

**SonarCloud** é uma plataforma cloud para análise contínua de qualidade de código que:
- ✅ Detecta bugs e vulnerabilidades
- ✅ Mede cobertura de testes
- ✅ Identifica duplicação de código
- ✅ Valida padrões de código
- ✅ Gera relatórios detalhados
- ✅ Integra com GitHub automaticamente

## 🚀 Setup Inicial (Uma vez)

### 1. Criar conta no SonarCloud

1. Acesse: **https://sonarcloud.io**
2. Clique em **Sign up** (ou **Log in** se já tiver conta)
3. Escolha **GitHub** como provedor de autenticação
4. Autorize o acesso ao GitHub

### 2. Criar organização (se primeira vez)

1. Em SonarCloud, clique em **Create organization**
2. Escolha um nome único para sua organização
3. Anote a **Organization Key** (será usado depois)

### 3. Criar projetos no SonarCloud

#### Para o Backend:
1. No SonarCloud, clique em **Analyze new project**
2. Selecione seu repositório **Price-Watch**
3. **Project name**: `pricewatch-backend`
4. **Project key**: `pricewatch-backend`
5. Confirme

#### Para o Frontend:
1. Repita o processo com:
   - **Project name**: `pricewatch-frontend`
   - **Project key**: `pricewatch-frontend`

### 4. Gerar token de autenticação

1. Em SonarCloud, vá para **Account > Security**
2. Clique em **Generate token**
3. Nomeie como: `GitHub-Price-Watch`
4. **Copie o token** (você não verá novamente!)

## 🔑 Configurar Secrets no GitHub

1. Acesse o repositório no GitHub
2. Vá para **Settings > Secrets and variables > Actions**
3. Clique em **New repository secret**
4. Crie o secret:
   - **Name**: `SONAR_TOKEN`
   - **Value**: Cole o token copiado do SonarCloud

## 📁 Arquivos de Configuração

Os arquivos já foram criados no projeto:

```
backend/sonar-project.properties      # Configuração do backend
frontend/sonar-project.properties     # Configuração do frontend
.github/workflows/deploy-backend-docker.yml    # CI/CD backend com SonarCloud
.github/workflows/frontend-quality.yml         # CI/CD frontend com SonarCloud
```

### Editar configurações (opcional)

Se precisar ajustar, edite os arquivos `.properties`:

**Backend** (`backend/sonar-project.properties`):
```properties
sonar.projectKey=pricewatch-backend
sonar.projectName=PriceWatch Backend
sonar.organization=SUA-ORG-KEY
```

**Frontend** (`frontend/sonar-project.properties`):
```properties
sonar.projectKey=pricewatch-frontend
sonar.projectName=PriceWatch Frontend
sonar.organization=SUA-ORG-KEY
```

## 🔄 Como Funciona

### Automatic Scan (CI/CD)
Quando você faz `push` ou cria `pull_request`:

1. ✅ Testes e cobertura são executados
2. ✅ ESLint valida o código
3. ✅ **SonarCloud faz scan automático**
4. ✅ Relatório é publicado em SonarCloud
5. ✅ **Comentário no PR com resultado**

### Local Development (Opcional)

Para analisar código localmente com SonarLint:

#### Instalar extensão VS Code (opcional)
1. No VS Code, abra **Extensions** (`Ctrl+Shift+X`)
2. Procure por **SonarLint**
3. Instale a extensão by SonarSource
4. Reinicie VS Code

#### Conectar ao SonarCloud (opcional)
1. Abra a Command Palette (`Ctrl+Shift+P`)
2. Digite: **SonarLint: Connect to SonarCloud**
3. Selecione sua organização
4. Selecione o projeto (backend ou frontend)
5. Pronto! Agora verá issues enquanto digita

## 📊 Visualizar Relatórios

### Dashboard do SonarCloud
- URL: `https://sonarcloud.io/dashboard?id=pricewatch-backend`
- URL: `https://sonarcloud.io/dashboard?id=pricewatch-frontend`

### No Pull Request
SonarCloud comenta automaticamente no PR com:
- ✅ Quality Gate status (Pass/Fail)
- 📊 Cobertura de código
- 🐛 Bugs detectados
- 🔒 Vulnerabilidades
- 💾 Duplicação de código

## 🎯 Quality Gates

Quality Gates são regras que determinam se a build passa ou falha:

**Default (SonarCloud):**
- ✅ Rating >= A (para segurança, confiabilidade, etc)
- ✅ Coverage >= 80%
- ✅ Zero novos bugs

Se falhar, você pode:
1. **Corrigir o código** e fazer novo commit
2. **Editar Quality Gate** (em SonarCloud) se a regra é muito rigorosa

### Customizar Quality Gate

1. Em SonarCloud, vá para **Quality Gates**
2. Crie novo ou edite o padrão
3. Configure condições:
   - Coverage (%)
   - Duplicated Lines (%)
   - Issues (High, Medium, Low)
4. Atribua ao projeto

## 🐛 Tipos de Issues Detectadas

SonarCloud detecta:

| Tipo | Descrição |
|------|-----------|
| **Bug** | Código que provavelmente está errado |
| **Vulnerability** | Risco de segurança |
| **Security Hotspot** | Áreas para revisar segurança |
| **Code Smell** | Problemas de manutenibilidade |
| **Duplicate** | Código duplicado |

Cada issue tem **severidade**:
- 🔴 Blocker / Critical
- 🟠 Major
- 🟡 Minor
- 🔵 Info

## 📝 Exemplo de Workflow

1. **Você escreve código** no backend
2. **Faz commit e push** para branch
3. **Cria Pull Request** no GitHub
4. **GitHub Actions executa**:
   - ✅ Testes
   - ✅ Linting
   - ✅ SonarCloud scan
5. **SonarCloud comenta no PR**:
   ```
   ✅ Quality Gate PASSED
   Coverage: 75% (target: 70%)
   Maintainability Rating: A
   0 new bugs, 0 vulnerabilities
   ```
6. **Aprova e faz merge** (se tudo verde)
7. **Main branch também é scanned**

## 🔗 Links Úteis

- **SonarCloud Docs**: https://docs.sonarcloud.io/
- **SonarQube vs SonarCloud**: https://www.sonarsource.com/products/sonarcloud/
- **GitHub Integration**: https://docs.sonarcloud.io/improving/github-integration/
- **Quality Gates**: https://docs.sonarcloud.io/improving/quality-gates/

## ❓ Troubleshooting

### SonarCloud não aparece nos resultados do PR

1. Verifique se `SONAR_TOKEN` está em GitHub Secrets
2. Verifique se `sonar.projectKey` está correto
3. Verifique se projeto existe no SonarCloud
4. Veja o log do workflow em GitHub Actions

### Coverage não está sendo reportado

1. Certifique-se de que `npm run coverage` gera `coverage/lcov.info`
2. Verifique o arquivo `sonar-project.properties`:
   ```properties
   sonar.javascript.lcov.reportPaths=coverage/lcov.info
   ```

### Quality Gate falhando

1. Veja o dashboard em SonarCloud
2. Identifique qual métrica falhou
3. Corrija o código ou ajuste a regra no Quality Gate

## 🎓 Dicas Importantes

- **SonarCloud é gratuito** para repositórios públicos
- **Análise é executada automaticamente** em cada push/PR
- **Não precisa instalar nada local** (funciona na CI/CD)
- **SonarLint no VS Code** ajuda a detectar issues enquanto escreve
- **Organize exclusões** em `.properties` para não escanear testes, mocks, etc

---

**Próximas passos:**
1. ✅ Criar conta no SonarCloud (se não tiver)
2. ✅ Criar organização (se primeira vez)
3. ✅ Gerar `SONAR_TOKEN`
4. ✅ Adicionar token ao GitHub Secrets
5. ✅ Fazer `push` para disparar primeira análise
6. ✅ Visualizar resultado no SonarCloud dashboard
