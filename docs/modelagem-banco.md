# Modelagem do Banco de Dados

## Banco Escolhido

O PriceWatch usa PostgreSQL por ser um banco relacional robusto, adequado para representar produtos, favoritos, alertas e histórico de preços.

## ORM

O Prisma foi escolhido para modelar as tabelas, gerar o client de acesso ao banco e facilitar a evolução da estrutura por meio de migrations.

## Tabelas

### Product

Representa um produto monitorado pelo sistema.

Campos principais:

- `id`: identificador interno.
- `externalId`: identificador do produto na API externa.
- `name`: nome do produto.
- `price`: preço atual conhecido.
- `imageUrl`: imagem do produto.
- `productUrl`: link externo do produto.
- `storeName`: nome da loja ou vendedor.
- `category`: categoria do produto.
- `createdAt`: data de criação.
- `updatedAt`: data de atualização.

### PriceHistory

Representa registros de variação de preço.

Campos principais:

- `id`: identificador interno.
- `productId`: referência ao produto.
- `oldPrice`: preço anterior.
- `newPrice`: novo preço capturado.
- `capturedAt`: data da captura.

### Favorite

Representa um produto favoritado.

Campos principais:

- `id`: identificador interno.
- `productId`: referência ao produto.
- `userName`: nome simples do usuário.
- `createdAt`: data de criação.

### PriceAlert

Representa um alerta de preço.

Campos principais:

- `id`: identificador interno.
- `productId`: referência ao produto.
- `targetPrice`: preço alvo.
- `email`: e-mail informado pelo usuário.
- `isActive`: indica se o alerta está ativo.
- `createdAt`: data de criação.

## Relacionamentos

- `Product` 1:N `PriceHistory`
- `Product` 1:N `Favorite`
- `Product` 1:N `PriceAlert`

## Observações para Próximas Sprints

- Criar tabela `User` caso o projeto passe a ter login.
- Evitar favoritos duplicados por usuário.
- Implementar coleta periódica de preços.
- Alimentar `PriceHistory` automaticamente.
- Criar rotina para disparar alertas.
