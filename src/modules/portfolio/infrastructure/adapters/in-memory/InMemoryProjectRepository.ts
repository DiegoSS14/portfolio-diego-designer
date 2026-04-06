import type { Project } from "../../../domain/entities/Project";
import type {
  ProjectRepository,
  ProjectUpsertPayload,
} from "../../../domain/repositories/ProjectRepository";

function getProjectRecencyTimestamp(project: Project): number {
  const candidate = project.updatedAt ?? project.createdAt;

  if (!candidate) {
    return 0;
  }

  const parsed = Date.parse(candidate);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export class InMemoryProjectRepository implements ProjectRepository {
  constructor(private readonly projects: Project[]) {}

  async findAll(): Promise<Project[]> {
    return [...this.projects].sort(
      (left, right) => getProjectRecencyTimestamp(right) - getProjectRecencyTimestamp(left),
    );
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const project = this.projects.find((item) => item.slug === slug);
    return project ?? null;
  }

  async create(payload: ProjectUpsertPayload): Promise<Project> {
    const nowIso = new Date().toISOString();
    const id = `${payload.slug}-${Date.now()}`;
    const project: Project = {
      id,
      ...payload,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.projects.unshift(project);

    return project;
  }

  async update(projectId: string, payload: ProjectUpsertPayload): Promise<Project | null> {
    const index = this.projects.findIndex((item) => item.id === projectId);

    if (index < 0) {
      return null;
    }

    const currentProject = this.projects[index];
    const updatedProject: Project = {
      id: projectId,
      ...payload,
      createdAt: currentProject.createdAt,
      updatedAt: new Date().toISOString(),
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
