import type { ProductDTO } from "./productService";

export const mockProducts: ProductDTO[] = [
  {
    id: "mock-notebook-acer",
    externalId: "MLB-MOCK-001",
    name: "Notebook Acer Aspire 5 Intel Core i5 8GB SSD 256GB",
    price: 2899.9,
    imageUrl: "https://http2.mlstatic.com/D_NQ_NP_2X_924372-MLA74651990001_022024-F.webp",
    productUrl: "https://www.mercadolivre.com.br/",
    storeName: "Mercado Livre",
    category: "Informática"
  },
  {
    id: "mock-smartphone-samsung",
    externalId: "MLB-MOCK-002",
    name: "Smartphone Samsung Galaxy 128GB Tela 6.6",
    price: 1499.99,
    imageUrl: "https://http2.mlstatic.com/D_NQ_NP_2X_943708-MLA75350427828_032024-F.webp",
    productUrl: "https://www.mercadolivre.com.br/",
    storeName: "Mercado Livre",
    category: "Celulares"
  },
  {
    id: "mock-fone-jbl",
    externalId: "MLB-MOCK-003",
    name: "Fone Bluetooth JBL Tune com Cancelamento de Ruído",
    price: 329.9,
    imageUrl: "https://http2.mlstatic.com/D_NQ_NP_2X_982149-MLU72757258761_112023-F.webp",
    productUrl: "https://www.mercadolivre.com.br/",
    storeName: "Mercado Livre",
    category: "Áudio"
  }
];
