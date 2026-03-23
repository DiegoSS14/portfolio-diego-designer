import type { ProjectRepository } from "../../domain/repositories/ProjectRepository";

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(projectId: string): Promise<boolean> {
    return this.projectRepository.delete(projectId);
  }
}
