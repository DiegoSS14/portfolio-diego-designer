import type { SessionStorage } from "../../domain/services/SessionStorage";

export class EndAdminSessionUseCase {
  constructor(private readonly sessionStorage: SessionStorage) {}

  async execute(): Promise<void> {
    await this.sessionStorage.clear();
  }
}
