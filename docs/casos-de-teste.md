# Casos de Teste

Documento inicial em andamento para organizar a suíte de testes do PriceWatch.

## CT01 - Cadastro do primeiro usuário
- Tipo: Unitário
- Objetivo: validar que o primeiro usuário criado recebe o papel de administrador.
- Status esperado: o usuário é salvo com `role = ADMIN` e um token é gerado.
- Base atual: coberto por teste unitário de `authService`.

## CT02 - Login com credenciais inválidas
- Tipo: Unitário
- Objetivo: validar a rejeição quando a senha não confere.
- Status esperado: o serviço retorna erro de credenciais inválidas.
- Base atual: coberto por teste unitário de `authService`.

## CT03 - Health check da API
- Tipo: Integração
- Objetivo: validar que a API sobe e responde no endpoint de status.
- Status esperado: resposta `200` com status `online`.
- Base atual: coberto por teste de integração da aplicação.

## CT04 - Registro e autenticação local
- Tipo: Integração
- Objetivo: validar o fluxo completo de cadastro, retorno do token e consulta de usuário autenticado.
- Status esperado: `POST /auth/register` retorna token e `GET /auth/me` devolve o usuário persistido.
- Base atual: coberto por teste de integração da aplicação.

## Próximos casos previstos
- Buscar produtos reais no Mercado Livre.
- Salvar favorito via API.
- Criar alerta de preço via API.
- Fluxo administrativo de lojas, categorias e histórico.
