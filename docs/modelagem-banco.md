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
- `isManual`: indica se o produto foi cadastrado manualmente por administrador.
- `isDeleted`: exclusão lógica para manter integridade com histórico e vínculos.
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
- `userId`: referência ao usuário autenticado.
- `userName`: nome simples do usuário.
- `createdAt`: data de criação.

### PriceAlert

Representa um alerta de preço.

Campos principais:

- `id`: identificador interno.
- `productId`: referência ao produto.
- `userId`: referência ao usuário autenticado.
- `targetPrice`: preço alvo.
- `email`: e-mail informado pelo usuário.
- `isActive`: indica se o alerta está ativo.
- `createdAt`: data de criação.

### User

Representa a conta local utilizada para autenticação e autorização.

Campos principais:

- `id`: identificador interno.
- `name`: nome opcional do usuário.
- `email`: e-mail único.
- `password`: senha com hash.
- `role`: papel de acesso (`USER` ou `ADMIN`).
- `createdAt`: data de criação.
- `updatedAt`: data de atualização.

### Store

Cadastro administrativo de lojas monitoradas.

Campos principais:

- `id`: identificador interno.
- `name`: nome da loja.
- `website`: website oficial.
- `contactEmail`: e-mail de contato.
- `isActive`: status de disponibilidade.
- `createdAt`: data de criação.
- `updatedAt`: data de atualização.

### Category

Cadastro administrativo de categorias usadas no catálogo.

Campos principais:

- `id`: identificador interno.
- `name`: nome da categoria.
- `description`: descrição da categoria.
- `isActive`: status de disponibilidade.
- `createdAt`: data de criação.
- `updatedAt`: data de atualização.

### PriceHistoryEntry

Cadastro administrativo de histórico para relatórios gerais.

Campos principais:

- `id`: identificador interno.
- `productName`: nome textual do produto.
- `oldPrice`: preço anterior.
- `newPrice`: preço novo.
- `capturedAt`: data da captura.

## Relacionamentos

- `Product` 1:N `PriceHistory`
- `Product` 1:N `Favorite`
- `Product` 1:N `PriceAlert`
- `User` 1:N `Favorite`
- `User` 1:N `PriceAlert`

## Observações para Próximas Sprints

- Evitar favoritos duplicados por usuário com índice composto.
- Implementar coleta periódica de preços para alimentar histórico automaticamente.
- Criar rotina de notificação real para disparo de alertas por e-mail.
