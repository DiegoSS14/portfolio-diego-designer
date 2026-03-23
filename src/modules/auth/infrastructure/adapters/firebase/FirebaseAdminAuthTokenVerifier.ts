import type {
  AuthTokenVerifier,
  VerifiedAuthUser,
} from "../../../domain/services/AuthTokenVerifier";
import { getFirebaseAdminAuthClient } from "@/modules/shared/infrastructure/adapters/firebase-admin/firebaseAdminClient";

export class FirebaseAdminAuthTokenVerifier implements AuthTokenVerifier {
  async verifyIdToken(idToken: string): Promise<VerifiedAuthUser | null> {
    if (!idToken) {
      return null;
    }

    try {
      const decodedToken = await getFirebaseAdminAuthClient().verifyIdToken(idToken, true);

      return {
        uid: decodedToken.uid,
        email: decodedToken.email ?? null,
        isAdmin: decodedToken.admin === true,
      };
    } catch {
      return null;
    }
  }
}
