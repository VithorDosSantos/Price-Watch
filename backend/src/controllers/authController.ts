import type { Request, Response } from "express";
import { getMercadoLivreAuthorizationUrl, getMercadoLivreToken } from "../services/mercadoLivreAuthService";

export function mercadoLivreLoginController(_request: Request, response: Response) {
  try {
    return response.redirect(getMercadoLivreAuthorizationUrl());
  } catch (error) {
    return response.status(500).json({
      message: error instanceof Error ? error.message : "Erro ao gerar URL de autenticação."
    });
  }
}

export async function mercadoLivreCallbackController(request: Request, response: Response) {
  const code = String(request.query.code ?? "");

  if (!code) {
    return response.status(400).json({
      message: "Código de autorização não recebido. Abra /auth/login para autorizar a aplicação."
    });
  }

  try {
    const token = await getMercadoLivreToken(code);

    return response.json({
      message: "Token do Mercado Livre gerado com sucesso. Guarde esses dados no .env do back-end.",
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresIn: token.expires_in,
      tokenType: token.token_type,
      userId: token.user_id
    });
  } catch (error) {
    return response.status(500).json({
      message: "Erro ao trocar o código pelo token do Mercado Livre.",
      details: error instanceof Error ? error.message : "Erro desconhecido."
    });
  }
}
