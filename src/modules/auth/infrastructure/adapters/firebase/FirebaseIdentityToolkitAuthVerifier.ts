import type {
  AuthTokenVerifier,
  VerifiedAuthUser,
} from "../../../domain/services/AuthTokenVerifier";

interface FirebaseLookupUser {
  localId?: string;
  email?: string;
}

interface FirebaseLookupResponse {
  users?: FirebaseLookupUser[];
}

function readFirebaseApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is required for auth verification.");
  }

  return apiKey;
}

export class FirebaseIdentityToolkitAuthVerifier implements AuthTokenVerifier {
  async verifyIdToken(idToken: string): Promise<VerifiedAuthUser | null> {
    if (!idToken) {
      return null;
    }

    const apiKey = readFirebaseApiKey();
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as FirebaseLookupResponse;
    const firebaseUser = payload.users?.[0];

    if (!firebaseUser?.localId) {
      return null;
    }

    return {
      uid: firebaseUser.localId,
      email: firebaseUser.email ?? null,
      isAdmin: false,
    };
  }
}
