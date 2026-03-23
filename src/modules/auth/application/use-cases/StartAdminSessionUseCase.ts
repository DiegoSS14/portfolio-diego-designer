import type { AdminSession } from "../../domain/entities/AdminSession";
import type { AdminPolicy } from "../../domain/services/AdminPolicy";
import type { AuthTokenVerifier } from "../../domain/services/AuthTokenVerifier";
import type { SessionFactory } from "../../domain/services/SessionFactory";
import type { SessionStorage } from "../../domain/services/SessionStorage";

interface StartAdminSessionInput {
  idToken: string;
}

export class StartAdminSessionUseCase {
  constructor(
    private readonly tokenVerifier: AuthTokenVerifier,
    private readonly adminPolicy: AdminPolicy,
    private readonly sessionFactory: SessionFactory,
    private readonly sessionStorage: SessionStorage,
  ) {}

  async execute(input: StartAdminSessionInput): Promise<AdminSession | null> {
    const verifiedUser = await this.tokenVerifier.verifyIdToken(input.idToken);

    if (!verifiedUser) {
      return null;
    }

    const isAdmin = this.adminPolicy.isAdmin(verifiedUser);

    if (!isAdmin) {
      return null;
    }

    const session = this.sessionFactory.createForUser(verifiedUser.uid, verifiedUser.email, true);

    await this.sessionStorage.write(session);

    return session;
  }
}
