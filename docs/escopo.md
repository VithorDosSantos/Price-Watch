# Escopo do PriceWatch

## Visão Geral

O PriceWatch é um sistema web acadêmico para monitoramento de preços de produtos. A aplicação permite pesquisar produtos, visualizar informações de preço, favoritar itens, criar alertas e consultar um dashboard simples com produtos monitorados.

## Objetivo da Sprint 1

Criar a base inicial do projeto com front-end, back-end, modelagem de banco, documentação e identificação da API externa. O foco da Sprint 1 é entregar um esqueleto funcional, navegável e organizado para evolução nas próximas etapas.

## Funcionalidades Contempladas

- Página inicial com busca de produtos.
- Integração da busca com a rota `GET /products/search`.
- Cards com nome, imagem, preço e acesso aos detalhes.
- Página de detalhes do produto.
- Página de favoritos.
- Página de alertas de preço.
- Dashboard simples com produtos monitorados.
- API REST com rotas de saúde, produtos, favoritos e alertas.
- Integração com SerpApi Google Shopping.
- Persistência dos produtos retornados para suportar detalhes, favoritos e alertas.
- Modelagem inicial do banco PostgreSQL com Prisma.

## Fora do Escopo da Sprint 1

- Login e autenticação.
- Envio real de e-mail.
- Coleta automática periódica de preços.
- Gráficos totalmente dinâmicos.
- Deploy em produção.
- Sistema multiusuário completo.

## Critérios de Sucesso

- O repositório deve ter estrutura profissional.
- O README deve conter instruções de instalação e execução.
- O front-end deve ser navegável.
- O back-end deve responder pelo menos a rota `GET /health`.
- A busca deve consultar a SerpApi.
- A modelagem do banco deve estar documentada.
- Os casos de uso devem estar descritos.
