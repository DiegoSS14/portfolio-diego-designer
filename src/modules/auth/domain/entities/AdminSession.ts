export interface AdminSession {
  uid: string;
  email: string | null;
  isAdmin: boolean;
  issuedAt: number;
  expiresAt: number;
}
