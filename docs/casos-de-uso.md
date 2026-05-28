# Casos de Uso

Este documento usa um padrão único com ator, pré-condições, fluxo principal, fluxos alternativos e pós-condições.

## UC01 - Pesquisar Produtos

- Ator: Usuário
- Pré-condições: O sistema está disponível e o usuário está na página inicial.
- Fluxo principal:
	1. O usuário informa um termo de busca.
	2. O sistema consulta a SerpApi Google Shopping.
	3. O sistema salva os produtos retornados no banco local.
	4. O sistema exibe os produtos encontrados.
- Fluxos alternativos:
	- A1: Se a busca vier vazia, o sistema mantém a vitrine inicial.
	- A2: Se não houver resultados, o sistema informa que nenhum produto foi encontrado.
- Pós-condições: Os resultados da busca ficam visíveis para navegação e seleção.

## UC02 - Visualizar Produtos em Destaque

- Ator: Usuário
- Pré-condições: A página inicial foi carregada.
- Fluxo principal:
	1. O sistema apresenta os produtos em destaque.
	2. O usuário consulta nome, imagem, preço e loja nos cards.
	3. O usuário escolhe um card para continuar a navegação.
- Fluxos alternativos:
	- A1: Se não houver dados reais, o sistema exibe produtos de demonstração.
- Pós-condições: O usuário visualizou a vitrine inicial do sistema.

## UC03 - Visualizar Detalhes de Produto

- Ator: Usuário
- Pré-condições: Existe um produto listado na busca, vitrine ou favoritos.
- Fluxo principal:
	1. O usuário seleciona um produto.
	2. O sistema abre a tela de detalhes.
	3. O sistema exibe descrição, preço atual, histórico e lojas comparáveis.
- Fluxos alternativos:
	- A1: Se o produto não existir, o sistema informa que o item não foi encontrado.
- Pós-condições: O usuário acessou a visão detalhada do produto.

## UC04 - Consultar Histórico de Preço

- Ator: Usuário
- Pré-condições: O produto possui dados de preço anteriores ou dados simulados.
- Fluxo principal:
	1. O sistema recupera os valores de histórico do produto.
	2. O sistema renderiza o gráfico de evolução de preço.
	3. O usuário analisa a tendência de queda ou aumento.
- Fluxos alternativos:
	- A1: Se não houver histórico real, o sistema exibe uma série simulada para demonstração.
- Pós-condições: O usuário visualizou a evolução do preço do produto.

## UC05 - Comparar Preços entre Lojas

- Ator: Usuário
- Pré-condições: O produto possui mais de uma oferta associada.
- Fluxo principal:
	1. O sistema lista lojas e preços para o produto.
	2. O usuário compara os valores exibidos.
	3. O usuário pode abrir a loja de interesse.
- Fluxos alternativos:
	- A1: Se houver apenas uma loja, o sistema exibe somente a oferta disponível.
- Pós-condições: O usuário tem uma visão comparativa dos preços.

## UC06 - Cadastrar Produto no Sistema

- Ator: Usuário autenticado ou processo de integração.
- Pré-condições: O produto foi localizado pela busca ou recebido por integração externa.
- Fluxo principal:
	1. O sistema recebe os dados do produto.
	2. O sistema valida campos obrigatórios como identificador externo, nome e preço.
	3. O sistema grava o produto no banco de dados.
- Fluxos alternativos:
	- A1: Se o produto já existir, o sistema evita duplicidade.
	- A2: Se algum dado obrigatório estiver ausente, o sistema rejeita o cadastro.
- Pós-condições: O produto passa a existir na base do sistema.

## UC07 - Atualizar Produto

- Ator: Administrador ou integração de sincronização.
- Pré-condições: O produto já existe no banco.
- Fluxo principal:
	1. O sistema localiza o produto pelo identificador.
	2. O ator altera nome, preço, categoria, imagem ou link.
	3. O sistema valida os novos dados.
	4. O sistema salva as alterações.
- Fluxos alternativos:
	- A1: Se o produto não for encontrado, o sistema informa erro de atualização.
- Pós-condições: O cadastro do produto fica atualizado.

## UC08 - Remover Produto

- Ator: Administrador.
- Pré-condições: O produto existe e não está bloqueado por uma regra de negócio.
- Fluxo principal:
	1. O ator solicita a exclusão do produto.
	2. O sistema verifica dependências como favoritos, alertas e histórico.
	3. O sistema remove o produto ou aplica remoção lógica.
- Fluxos alternativos:
	- A1: Se houver dependências ativas, o sistema impede a exclusão física.
- Pós-condições: O produto deixa de estar disponível no catálogo administrativo.

## UC09 - Favoritar Produto

- Ator: Usuário.
- Pré-condições: O produto está disponível para seleção.
- Fluxo principal:
	1. O usuário aciona a opção de favoritar.
	2. O sistema cria o vínculo entre usuário e produto.
	3. O sistema confirma o registro do favorito.
- Fluxos alternativos:
	- A1: Se o favorito já existir, o sistema evita duplicidade.
- Pós-condições: O produto fica salvo na lista de favoritos.

## UC10 - Listar Favoritos

- Ator: Usuário.
- Pré-condições: O usuário possui favoritos cadastrados ou a lista está vazia.
- Fluxo principal:
	1. O usuário acessa a página de favoritos.
	2. O sistema consulta os itens salvos.
	3. O sistema exibe os produtos favoritados.
- Fluxos alternativos:
	- A1: Se não houver favoritos, o sistema apresenta uma mensagem de estado vazio.
- Pós-condições: O usuário visualizou sua lista de favoritos.

## UC11 - Remover Favorito

- Ator: Usuário.
- Pré-condições: O item já está salvo como favorito.
- Fluxo principal:
	1. O usuário solicita a remoção do favorito.
	2. O sistema exclui o vínculo do produto com o usuário.
	3. O sistema atualiza a lista exibida.
- Fluxos alternativos:
	- A1: Se o item não existir mais, o sistema apenas atualiza a interface.
- Pós-condições: O favorito deixa de ser exibido na lista do usuário.

## UC12 - Criar Alerta de Preço

- Ator: Usuário.
- Pré-condições: O produto existe e o usuário informa um preço alvo válido.
- Fluxo principal:
	1. O usuário informa produto, preço alvo e e-mail.
	2. O sistema valida os dados recebidos.
	3. O sistema grava o alerta com status ativo.
- Fluxos alternativos:
	- A1: Se o preço alvo for inválido, o sistema rejeita o cadastro.
	- A2: Se o produto não existir, o sistema não cria o alerta.
- Pós-condições: O alerta fica disponível para monitoramento.

## UC13 - Listar Alertas de Preço

- Ator: Usuário.
- Pré-condições: O usuário possui alertas cadastrados ou a lista está vazia.
- Fluxo principal:
	1. O usuário acessa a página de alertas.
	2. O sistema recupera os alertas do banco.
	3. O sistema apresenta status, preço alvo e produto associado.
- Fluxos alternativos:
	- A1: Se não houver alertas, o sistema exibe orientação para criar o primeiro alerta.
- Pós-condições: O usuário visualizou seus alertas cadastrados.

## UC14 - Atualizar Alerta de Preço

- Ator: Usuário.
- Pré-condições: O alerta existe.
- Fluxo principal:
	1. O usuário altera preço alvo, e-mail ou status do alerta.
	2. O sistema valida as novas informações.
	3. O sistema atualiza o registro.
- Fluxos alternativos:
	- A1: Se o alerta não for encontrado, o sistema informa erro.
- Pós-condições: O alerta fica com os novos dados persistidos.

## UC15 - Remover Alerta de Preço

- Ator: Usuário.
- Pré-condições: O alerta existe e está visível na lista.
- Fluxo principal:
	1. O usuário solicita a remoção do alerta.
	2. O sistema confirma a ação.
	3. O sistema exclui o alerta do banco.
- Fluxos alternativos:
	- A1: Se a remoção não puder ser concluída, o sistema mantém o alerta ativo.
- Pós-condições: O alerta deixa de existir para o usuário.

## Como chegar a 5 CRUDs no projeto

Hoje o projeto já possui três áreas com operação de criação, leitura e remoção ou atualização: Produtos, Favoritos e Alertas. Para atender ao requisito acadêmico de pelo menos cinco telas CRUD, as duas expansões mais naturais do domínio são:

- Histórico de Preços: CRUD para registros de variação de preço por produto.
- Lojas Monitoradas ou Integração de Notificações: CRUD para cadastrar, listar, atualizar e remover lojas ou registros de notificações recebidas.

Se for necessário completar o mínimo com ainda mais segurança, a terceira expansão recomendada é uma entidade de administração, como Categorias Monitoradas, que permite tela própria, filtros e manutenção de catálogo.

Essas expansões fazem sentido porque aproveitam os modelos já existentes em `Product` e `PriceHistory`, e mantêm o sistema coerente com a proposta de monitoramento de preços.
