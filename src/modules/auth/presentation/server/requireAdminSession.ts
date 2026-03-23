import { createAuthDependencies } from "../../infrastructure/factories/createAuthDependencies";

export async function requireAdminSession() {
  const { getCurrentAdminSessionUseCase } = createAuthDependencies();
  const session = await getCurrentAdminSessionUseCase.execute();

  if (!session?.isAdmin) {
    return null;
  }

  return session;
}
