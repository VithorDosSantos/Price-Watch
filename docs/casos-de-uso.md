# Casos de Uso

## UC01 - Pesquisar Produtos

O usuário informa um termo de busca e o sistema exibe produtos encontrados pela API do Mercado Livre ou por dados mockados.

## UC02 - Visualizar Cards de Produtos

O usuário visualiza nome, imagem, preço, loja e variação de preço nos cards da página inicial.

## UC03 - Abrir Detalhes de Produto

O usuário seleciona um produto e acessa uma página com informações detalhadas.

## UC04 - Consultar Histórico de Preço

O usuário visualiza uma representação inicial do histórico de preços de um produto.

## UC05 - Comparar Preços por Loja

O usuário consulta uma lista inicial de lojas e preços disponíveis para o produto.

## UC06 - Favoritar Produto

O usuário marca um produto como favorito para acompanhar posteriormente.

## UC07 - Listar Produtos Favoritos

O usuário acessa a página de favoritos para visualizar os produtos salvos.

## UC08 - Criar Alerta de Preço

O usuário informa um preço alvo para acompanhar determinado produto.

## UC09 - Listar Alertas de Preço

O usuário acessa a página de alertas e consulta os alertas cadastrados.

## UC10 - Ativar ou Desativar Alerta

O usuário altera o status de um alerta de preço.

## UC11 - Remover Alerta

O usuário remove um alerta que não deseja mais acompanhar.

## UC12 - Consultar Dashboard

O usuário acessa o dashboard para visualizar um resumo dos produtos monitorados.

## UC13 - Consultar Status da API

O desenvolvedor acessa `GET /health` para verificar se o back-end está online.

## UC14 - Usar Dados Mockados em Caso de Falha

O sistema retorna dados simulados quando a API externa ou o back-end não estiver disponível.

## UC15 - Salvar Produto no Banco

Ao favoritar ou criar alerta, o sistema registra o produto no banco de dados.

## UC16 - Registrar Favorito no Banco

O sistema salva o produto favoritado na tabela `Favorite`.

## UC17 - Registrar Alerta no Banco

O sistema salva o alerta na tabela `PriceAlert`.

## UC18 - Preparar Histórico de Preços

O banco possui a tabela `PriceHistory` para permitir evolução futura da coleta de preços.
