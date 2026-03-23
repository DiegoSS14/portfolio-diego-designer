export interface VerifiedAuthUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

export interface AuthTokenVerifier {
  verifyIdToken(idToken: string): Promise<VerifiedAuthUser | null>;
}
