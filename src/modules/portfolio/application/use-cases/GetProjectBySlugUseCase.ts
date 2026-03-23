import type { Project } from "../../domain/entities/Project";
import type { ProjectRepository } from "../../domain/repositories/ProjectRepository";

export class GetProjectBySlugUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(slug: string): Promise<Project | null> {
    if (!slug) {
      return null;
    }

    return this.projectRepository.findBySlug(slug);
  }
}
