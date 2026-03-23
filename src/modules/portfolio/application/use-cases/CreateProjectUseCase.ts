import type { Project } from "../../domain/entities/Project";
import type {
  ProjectRepository,
  ProjectUpsertPayload,
} from "../../domain/repositories/ProjectRepository";

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(payload: ProjectUpsertPayload): Promise<Project> {
    return this.projectRepository.create(payload);
  }
}
