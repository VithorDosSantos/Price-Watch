import { prisma } from "../prisma/client";

type MercadoLivreTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
  user_id: number;
};

const mercadoLivreAuthUrl = "https://auth.mercadolivre.com.br/authorization";
const mercadoLivreTokenUrl = "https://api.mercadolibre.com/oauth/token";
const provider = "mercado-livre";

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
    redirect_uri: redirectUri,
    scope: "offline_access read"
  });

  return `${mercadoLivreAuthUrl}?${params.toString()}`;
}

async function requestMercadoLivreToken(body: URLSearchParams): Promise<MercadoLivreTokenResponse> {
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

function getExpiresAt(expiresIn: number): Date {
  return new Date(Date.now() + expiresIn * 1000);
}

async function saveMercadoLivreCredential(token: MercadoLivreTokenResponse) {
  return prisma.externalApiCredential.upsert({
    where: { provider },
    update: {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      tokenType: token.token_type,
      userId: String(token.user_id),
      expiresAt: getExpiresAt(token.expires_in)
    },
    create: {
      provider,
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      tokenType: token.token_type,
      userId: String(token.user_id),
      expiresAt: getExpiresAt(token.expires_in)
    }
  });
}

export async function getMercadoLivreToken(code: string): Promise<MercadoLivreTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: getRequiredEnv("MERCADO_LIVRE_CLIENT_ID"),
    client_secret: getRequiredEnv("MERCADO_LIVRE_CLIENT_SECRET"),
    code,
    redirect_uri: getRequiredEnv("MERCADO_LIVRE_REDIRECT_URI")
  });

  const token = await requestMercadoLivreToken(body);
  await saveMercadoLivreCredential(token);

  return token;
}

export async function refreshMercadoLivreToken(refreshToken: string): Promise<MercadoLivreTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: getRequiredEnv("MERCADO_LIVRE_CLIENT_ID"),
    client_secret: getRequiredEnv("MERCADO_LIVRE_CLIENT_SECRET"),
    refresh_token: refreshToken
  });

  const token = await requestMercadoLivreToken(body);
  await saveMercadoLivreCredential(token);

  return token;
}

export async function getValidMercadoLivreAccessToken(): Promise<string | null> {
  const credential = await prisma.externalApiCredential.findUnique({
    where: { provider }
  });

  const minimumValidityMs = 60 * 1000;

  if (credential?.accessToken && credential.expiresAt && credential.expiresAt.getTime() > Date.now() + minimumValidityMs) {
    return credential.accessToken;
  }

  const refreshToken = credential?.refreshToken ?? process.env.MERCADO_LIVRE_REFRESH_TOKEN;

  if (refreshToken) {
    const token = await refreshMercadoLivreToken(refreshToken);
    return token.access_token;
  }

  return process.env.MERCADO_LIVRE_ACCESS_TOKEN ?? null;
}

export async function getMercadoLivreCredentialStatus() {
  const credential = await prisma.externalApiCredential.findUnique({
    where: { provider },
    select: {
      provider: true,
      tokenType: true,
      userId: true,
      expiresAt: true,
      updatedAt: true
    }
  });

  return {
    configured: Boolean(credential || process.env.MERCADO_LIVRE_ACCESS_TOKEN || process.env.MERCADO_LIVRE_REFRESH_TOKEN),
    storedInDatabase: Boolean(credential),
    tokenType: credential?.tokenType,
    userId: credential?.userId,
    expiresAt: credential?.expiresAt,
    updatedAt: credential?.updatedAt
  };
}
