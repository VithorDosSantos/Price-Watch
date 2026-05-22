import { afterEach, describe, expect, it } from "vitest";
import { getMercadoLivreAuthorizationUrl } from "../../src/services/mercadoLivreAuthService";

describe("mercadoLivreAuthService", () => {
  afterEach(() => {
    delete process.env.MERCADO_LIVRE_CLIENT_ID;
    delete process.env.MERCADO_LIVRE_REDIRECT_URI;
  });

  it("gera a URL de autorização com os parâmetros obrigatórios", () => {
    process.env.MERCADO_LIVRE_CLIENT_ID = "app-id-123";
    process.env.MERCADO_LIVRE_REDIRECT_URI = "http://localhost:3333/auth/callback";

    const url = getMercadoLivreAuthorizationUrl();
    const parsed = new URL(url);

    expect(parsed.origin).toBe("https://auth.mercadolivre.com.br");
    expect(parsed.pathname).toBe("/authorization");
    expect(parsed.searchParams.get("response_type")).toBe("code");
    expect(parsed.searchParams.get("client_id")).toBe("app-id-123");
    expect(parsed.searchParams.get("redirect_uri")).toBe("http://localhost:3333/auth/callback");
    expect(parsed.searchParams.get("scope")).toBe("offline_access read");
  });

  it("rejeita quando as variáveis obrigatórias não existem", () => {
    expect(() => getMercadoLivreAuthorizationUrl()).toThrow(
      "Variável de ambiente MERCADO_LIVRE_CLIENT_ID não configurada."
    );
  });
});
