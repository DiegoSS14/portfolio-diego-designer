import type { Project } from "../../../domain/entities/Project";
import type { ProjectRepository } from "../../../domain/repositories/ProjectRepository";

export class InMemoryProjectRepository implements ProjectRepository {
  constructor(private readonly projects: Project[]) {}

  async findAll(): Promise<Project[]> {
    return this.projects;
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const project = this.projects.find((item) => item.slug === slug);
    return project ?? null;
  }
}
