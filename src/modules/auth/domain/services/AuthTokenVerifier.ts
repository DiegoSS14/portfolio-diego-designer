export interface VerifiedAuthUser {
  uid: string;
  email: string | null;
}

export interface AuthTokenVerifier {
  verifyIdToken(idToken: string): Promise<VerifiedAuthUser | null>;
}
