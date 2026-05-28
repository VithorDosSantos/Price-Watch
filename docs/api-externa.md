# API Externa: SerpApi Google Shopping

## API Escolhida

A busca externa do PriceWatch usa a SerpApi com o engine `google_shopping`.

Endpoint principal:

```http
GET https://serpapi.com/search?engine=google_shopping&q=termo&gl=br&hl=pt-BR&api_key=SUA_CHAVE
```

## Justificativa

A SerpApi fornece resultados de shopping do Google com dados reais de preço, loja, imagem e link público, sem depender do fluxo OAuth que estava bloqueando a busca anterior.

## Campos Mapeados

O back-end usa principalmente:

- `shopping_results`.
- `title`.
- `product_id`.
- `link` e `product_link`.
- `price` e `extracted_price`.
- `thumbnail` e `serpapi_thumbnail`.
- `source`.

## Estratégia de Persistência

Os resultados retornados pela busca são convertidos para o modelo interno `Product` e salvos no banco local. Isso permite abrir detalhes, criar favoritos e registrar alertas sem depender de uma nova consulta externa no clique seguinte.

## Limitações Conhecidas

- Os preços representam o momento da consulta.
- A disponibilidade das ofertas pode mudar depois da persistência local.
- A busca depende de `SERPAPI_API_KEY` válido.

## Evoluções Futuras

- Paginação de resultados.
- Filtros adicionais do shopping.
- Normalização melhor de imagens e preços.
- Cache por consulta para reduzir chamadas externas.
