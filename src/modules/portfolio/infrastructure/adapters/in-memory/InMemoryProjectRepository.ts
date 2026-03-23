import type { Project } from "../../../domain/entities/Project";
import type {
  ProjectRepository,
  ProjectUpsertPayload,
} from "../../../domain/repositories/ProjectRepository";

export class InMemoryProjectRepository implements ProjectRepository {
  constructor(private readonly projects: Project[]) {}

  async findAll(): Promise<Project[]> {
    return this.projects;
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const project = this.projects.find((item) => item.slug === slug);
    return project ?? null;
  }

  async create(payload: ProjectUpsertPayload): Promise<Project> {
    const id = `${payload.slug}-${Date.now()}`;
    const project: Project = {
      id,
      ...payload,
    };

    this.projects.unshift(project);

    return project;
  }

  async update(projectId: string, payload: ProjectUpsertPayload): Promise<Project | null> {
    const index = this.projects.findIndex((item) => item.id === projectId);

    if (index < 0) {
      return null;
    }

    const updatedProject: Project = {
      id: projectId,
      ...payload,
    };

    this.projects[index] = updatedProject;

    return updatedProject;
  }

  async delete(projectId: string): Promise<boolean> {
    const index = this.projects.findIndex((item) => item.id === projectId);

    if (index < 0) {
      return false;
    }

    this.projects.splice(index, 1);

    return true;
  }
}
