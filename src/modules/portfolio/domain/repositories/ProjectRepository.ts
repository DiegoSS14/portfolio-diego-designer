import type { Project } from "../entities/Project";

export interface ProjectUpsertPayload {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  mediaUrls: string[];
  tags: string[];
}

export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
  create(payload: ProjectUpsertPayload): Promise<Project>;
  update(projectId: string, payload: ProjectUpsertPayload): Promise<Project | null>;
  delete(projectId: string): Promise<boolean>;
}
