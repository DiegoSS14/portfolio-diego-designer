import type { AdminSession } from "../../domain/entities/AdminSession";
import type { SessionStorage } from "../../domain/services/SessionStorage";

export class GetCurrentAdminSessionUseCase {
  constructor(private readonly sessionStorage: SessionStorage) {}

  async execute(): Promise<AdminSession | null> {
    const session = await this.sessionStorage.read();

    if (!session?.isAdmin) {
      return null;
    }

    return session;
  }
}
