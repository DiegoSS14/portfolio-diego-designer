import type { Project } from "../../domain/entities/Project";
import type {
  ProjectRepository,
  ProjectUpsertPayload,
} from "../../domain/repositories/ProjectRepository";

export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(projectId: string, payload: ProjectUpsertPayload): Promise<Project | null> {
    return this.projectRepository.update(projectId, payload);
  }
}
