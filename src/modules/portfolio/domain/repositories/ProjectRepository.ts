import type { Project } from "../entities/Project";

export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
}
