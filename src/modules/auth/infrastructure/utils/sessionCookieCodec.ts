import { createHmac, timingSafeEqual } from "node:crypto";

import type { AdminSession } from "../../domain/entities/AdminSession";

interface SessionPayload {
  uid: string;
  email: string | null;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf-8").toString("base64url");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf-8");
}

function createSignature(payloadBase64: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadBase64).digest("base64url");
}

export function encodeSessionCookie(session: AdminSession, secret: string): string {
  const payload: SessionPayload = {
    uid: session.uid,
    email: session.email,
    isAdmin: session.isAdmin,
    iat: session.issuedAt,
    exp: session.expiresAt,
  };

  const payloadBase64 = encodeBase64Url(JSON.stringify(payload));
  const signature = createSignature(payloadBase64, secret);

  return `${payloadBase64}.${signature}`;
}

export function decodeSessionCookie(token: string, secret: string): AdminSession | null {
  const [payloadBase64, providedSignature] = token.split(".");

  if (!payloadBase64 || !providedSignature) {
    return null;
  }

  const expectedSignature = createSignature(payloadBase64, secret);

  if (
    providedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(payloadBase64)) as Partial<SessionPayload>;

    if (
      typeof payload.uid !== "string" ||
      typeof payload.isAdmin !== "boolean" ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null;
    }

    return {
      uid: payload.uid,
      email: typeof payload.email === "string" ? payload.email : null,
      isAdmin: payload.isAdmin,
      issuedAt: payload.iat,
      expiresAt: payload.exp,
    };
  } catch {
    return null;
  }
}
