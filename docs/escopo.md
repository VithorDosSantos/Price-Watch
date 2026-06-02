# Escopo do PriceWatch

## Visão Geral

O PriceWatch é um sistema web acadêmico para monitoramento de preços de produtos. A aplicação permite pesquisar produtos, visualizar informações de preço, favoritar itens, criar alertas e consultar um dashboard simples com produtos monitorados.

## Objetivo da Sprint 1

Criar a base inicial do projeto com front-end, back-end, modelagem de banco, documentação e identificação da API externa. O foco da Sprint 1 é entregar um esqueleto funcional, navegável e organizado para evolução nas próximas etapas.

## Funcionalidades Contempladas

- Página inicial com busca de produtos.
- Integração da busca com a rota `GET /products/search`.
- Cards com nome, imagem, preço e acesso aos detalhes.
- Página de detalhes do produto com histórico de preços e ofertas comparáveis.
- Página de favoritos.
- Página de alertas de preço.
- CRUD administrativo de produtos, lojas, categorias e histórico de preços.
- Gestão administrativa de usuários.
- Login, registro, perfil e controle de acesso por papel (USER/ADMIN).
- Dashboard simples com produtos monitorados.
- API REST com rotas de saúde, produtos, favoritos e alertas.
- Integração com SerpApi Google Shopping.
- Persistência dos produtos retornados para suportar detalhes, favoritos e alertas.
- Modelagem do banco PostgreSQL com Prisma para usuários, produtos e relacionamentos.

## Fora do Escopo da Sprint 1

- Envio real de e-mail.
- Coleta automática periódica de preços.
- Deploy em produção.

## Estado Atual dos Requisitos Acadêmicos

- Front-end interativo: atendido.
- Back-end com lógica de negócio: atendido.
- Persistência em banco relacional: atendido.
- Integração com API externa (SerpApi): atendido.
- Mínimo de 5 telas com CRUD: atendido com Produtos, Lojas, Categorias, Histórico de Preços e Alertas.
- Mínimo de 15 casos de uso: atendido (UC01 a UC15).

## Critérios de Sucesso

- O repositório deve ter estrutura profissional.
- O README deve conter instruções de instalação e execução.
- O front-end deve ser navegável.
- O back-end deve responder pelo menos a rota `GET /health`.
- A busca deve consultar a SerpApi.
- A modelagem do banco deve estar documentada.
- Os casos de uso devem estar descritos.
