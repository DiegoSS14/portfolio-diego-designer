const FIREBASE_ERROR_CODES = [
  "permission-denied",
  "unavailable",
  "deadline-exceeded",
  "internal",
  "resource-exhausted",
  "failed-precondition",
];

const FIREBASE_ERROR_MESSAGE_HINTS = [
  "missing or insufficient permissions",
  "cloud firestore api has not been used",
  "cloud firestore backend",
];

export function isFirebaseServiceError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const errorCode = ((error as { code?: unknown }).code ?? "").toString().toLowerCase();
  const errorMessage = error.message.toLowerCase();

  const hasKnownCode = FIREBASE_ERROR_CODES.some((code) => errorCode.includes(code));
  const hasKnownMessage = FIREBASE_ERROR_MESSAGE_HINTS.some((hint) =>
    errorMessage.includes(hint),
  );

  return hasKnownCode || hasKnownMessage;
}