# 🚀 SonarCloud Setup Rápido (5 minutos)

## Passo 1: Conta SonarCloud
```
1. Acesse: https://sonarcloud.io
2. Click: Sign up → GitHub
3. Autorize acesso GitHub
4. Anote sua Organization Key (ex: "seu-usuario")
```

## Passo 2: Criar Projetos
```
SonarCloud → Analyze new project
  ├─ Backend:  "pricewatch-backend"
  └─ Frontend: "pricewatch-frontend"
```

## Passo 3: Gerar Token
```
SonarCloud → Account → Security → Generate token
Nome: "GitHub-Price-Watch"
[COPIE E GUARDE]
```

## Passo 4: GitHub Secret
```
GitHub Repo → Settings → Secrets → New secret
Name:  SONAR_TOKEN
Value: [Cole o token]
```

## Passo 5: Atualizar Arquivos (se necessário)

### backend/sonar-project.properties
Procure por:
```properties
sonar.projectKey=pricewatch-backend
sonar.projectName=PriceWatch Backend
```

### frontend/sonar-project.properties
Procure por:
```properties
sonar.projectKey=pricewatch-frontend
sonar.projectName=PriceWatch Frontend
```

## Passo 6: Testar
```bash
# Faça um commit
git add .
git commit -m "feat: add SonarCloud integration"
git push origin main

# GitHub Actions executará automaticamente
# Veja o resultado em: https://sonarcloud.io/dashboard
```

## ✅ Pronto!

Agora toda vez que você fizer push/PR:
- ✅ Testes rodam
- ✅ ESLint verifica
- ✅ **SonarCloud analisa código**
- ✅ Resultado comentado no PR

---

Para mais detalhes, veja: `SONARCLOUD.md`
