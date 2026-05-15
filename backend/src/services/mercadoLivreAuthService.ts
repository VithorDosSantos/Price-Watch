type MercadoLivreTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user_id: number;
};

const mercadoLivreAuthUrl = "https://auth.mercadolivre.com.br/authorization";
const mercadoLivreTokenUrl = "https://api.mercadolibre.com/oauth/token";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente ${name} não configurada.`);
  }

  return value;
}

export function getMercadoLivreAuthorizationUrl(): string {
  const clientId = getRequiredEnv("MERCADO_LIVRE_CLIENT_ID");
  const redirectUri = getRequiredEnv("MERCADO_LIVRE_REDIRECT_URI");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri
  });

  return `${mercadoLivreAuthUrl}?${params.toString()}`;
}

export async function getMercadoLivreToken(code: string): Promise<MercadoLivreTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: getRequiredEnv("MERCADO_LIVRE_CLIENT_ID"),
    client_secret: getRequiredEnv("MERCADO_LIVRE_CLIENT_SECRET"),
    code,
    redirect_uri: getRequiredEnv("MERCADO_LIVRE_REDIRECT_URI")
  });

  const response = await fetch(mercadoLivreTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data as MercadoLivreTokenResponse;
}
