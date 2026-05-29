# 📊 Fluxo CI/CD Completo - Price-Watch

## Backend: Deploy Backend Docker

```mermaid
graph TD
    A["👨‍💻 Push para main<br/>ou Pull Request"] --> B["🧪 Job: test-and-coverage"]
    
    B --> B1["📥 Checkout"]
    B1 --> B2["📦 Setup Node.js"]
    B2 --> B3["📚 npm ci"]
    B3 --> B4["✅ npm run lint"]
    B4 --> B5["🧪 npm run coverage<br/>gera: lcov.info"]
    B5 --> B6["📤 Upload coverage artifact"]
    B6 --> B7["📊 Valida cobertura >= 70%"]
    
    B7 --> C["🔍 Job: sonarcloud"]
    C --> C1["📥 Checkout"]
    C1 --> C2["📦 Setup Node.js"]
    C2 --> C3["📚 npm ci"]
    C3 --> C4["🧪 npm run coverage"]
    C4 --> C5["☁️ SonarCloud Scan"]
    C5 --> C6["📊 Publica no Dashboard"]
    C6 --> C7["💬 Comenta resultado no PR"]
    
    C7 --> D["🐳 Job: docker-build"]
    D --> D1["🏗️ Build Docker image"]
    D1 --> D2["✅ Build completo!"]
    
    style A fill:#e1f5ff
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e9
    style B7 fill:#ffebee
    style C6 fill:#f3e5f5
```

## Frontend: Quality Checks

```mermaid
graph TD
    A["👨‍💻 Push para main<br/>ou Pull Request"] --> B["🧪 Job: test-and-coverage"]
    
    B --> B1["📥 Checkout"]
    B1 --> B2["📦 Setup Node.js"]
    B2 --> B3["📚 npm ci"]
    B3 --> B4["✅ npm run lint"]
    B4 --> B5["💅 npm run format:check"]
    B5 --> B6["🧪 npm run coverage<br/>gera: lcov.info"]
    B6 --> B7["📤 Upload coverage artifact"]
    B7 --> B8["🎭 npm run test:e2e"]
    B8 --> B9["📤 Upload E2E results"]
    B9 --> B10["📊 Valida cobertura >= 70%"]
    
    B10 --> C["🔍 Job: sonarcloud"]
    C --> C1["📥 Checkout"]
    C1 --> C2["📦 Setup Node.js"]
    C2 --> C3["📚 npm ci"]
    C3 --> C4["🧪 npm run coverage"]
    C4 --> C5["☁️ SonarCloud Scan"]
    C5 --> C6["📊 Publica no Dashboard"]
    C6 --> C7["💬 Comenta resultado no PR"]
    
    C7 --> D["✅ Todos os checks passou!"]
    
    style A fill:#e1f5ff
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e9
    style B10 fill:#ffebee
    style C6 fill:#f3e5f5
```

## SonarCloud: Detalhes da Análise

```mermaid
graph LR
    A["📊 Código Submetido"] --> B["🔍 Análise SonarCloud"]
    
    B --> C1["🐛 Bugs"]
    B --> C2["🔒 Vulnerabilidades"]
    B --> C3["🔐 Security Hotspots"]
    B --> C4["💾 Code Smell"]
    B --> C5["📈 Cobertura"]
    B --> C6["📋 Duplicação"]
    
    C1 --> D["⚖️ Quality Gate"]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    C6 --> D
    
    D --> E{"Status?"}
    E -->|✅ PASSED| F["✅ PR pode fazer merge"]
    E -->|❌ FAILED| G["❌ PR bloqueado<br/>Corrija os problemas"]
    
    style A fill:#e1f5ff
    style B fill:#fff3e0
    style D fill:#f3e5f5
    style F fill:#e8f5e9
    style G fill:#ffebee
```

## Fluxo Semanal do Desenvolvedor

```mermaid
sequenceDiagram
    participant Dev as 👨‍💻 Developer
    participant Git as 🐙 GitHub
    participant GHA as ⚙️ GitHub Actions
    participant Sonar as ☁️ SonarCloud

    Dev->>Git: 1. git commit + push
    activate Git
    
    Git->>GHA: Dispara workflows
    deactivate Git
    activate GHA
    
    GHA->>GHA: 2. npm run test
    GHA->>GHA: 3. npm run lint
    GHA->>GHA: 4. npm run coverage
    
    GHA->>Sonar: 5. Envia dados (lcov.info)
    deactivate GHA
    activate Sonar
    
    Sonar->>Sonar: 6. Analisa bugs, vulns, duplicação
    Sonar->>Sonar: 7. Valida Quality Gate
    
    Sonar->>Git: 8. Comenta resultado no PR
    deactivate Sonar
    activate Git
    
    Git->>Dev: ✅ ou ❌ Resultado visível no PR
    deactivate Git
```

## Métricas Monitoradas

| Métrica | Backend | Frontend | Ferramenta |
|---------|---------|----------|-----------|
| **Code Coverage** | 70-80% | 70-80% | Vitest + lcov |
| **Bugs** | A (excelente) | A (excelente) | SonarCloud |
| **Vulnerabilities** | 0 | 0 | SonarCloud |
| **Code Smells** | Low | Low | SonarCloud |
| **Duplicated Lines** | < 3% | < 3% | SonarCloud |
| **Lint Errors** | 0 | 0 | ESLint |
| **Format Issues** | 0 | 0 | Prettier |
| **E2E Tests** | N/A | ✅ Pass | Playwright |

## Timeline de Verificação

```
┌─────────────────────────────────────────────┐
│  Sua Push / PR no GitHub                     │
└─────────────────┬───────────────────────────┘
                  │
          ┌───────▼────────┐
          │ 5-10 segundos  │ GitHub Actions inicia
          └───────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
  Testes      ESLint        Coverage
   2-5s        1-2s            1-2s
    │             │             │
    └─────────────┼─────────────┘
                  │
          ┌───────▼────────┐
          │ 30-60 segundos │ SonarCloud scan
          └───────┬────────┘
                  │
    ┌─────────────▼─────────────┐
    │ Resultado comentado no PR  │
    │ (Total: ~1-2 minutos)      │
    └───────────────────────────┘
```

## Exemplo de Comentário no PR

```
✅ Quality Gate PASSED

Coverage: 78% (target: 70%)
Maintainability Rating: A
Reliability Rating: A
Security Rating: A

🐛 Bugs: 0
🔒 Vulnerabilities: 0
🔐 Security Hotspots: 0
💾 Code Smells: 2
📋 Duplicated Lines: 0.5%

You can merge this PR! ✨
```

## Dashboard SonarCloud

```
pricewatch-backend
├─ Quality Gate: ✅ PASSED
├─ Coverage: 78%
├─ Maintainability: A
├─ Bugs: 0
├─ Vulnerabilities: 0
└─ Last Analysis: 5 minutes ago

pricewatch-frontend
├─ Quality Gate: ✅ PASSED
├─ Coverage: 75%
├─ Maintainability: A
├─ Bugs: 1 (medium)
├─ Vulnerabilities: 0
└─ Last Analysis: 5 minutes ago
```

---

**Próxima etapa:** Configure SONAR_TOKEN no GitHub para que tudo funcione automaticamente!
