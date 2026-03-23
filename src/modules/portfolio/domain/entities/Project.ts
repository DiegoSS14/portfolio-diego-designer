export type ProjectId = string;

export interface Project {
  id: ProjectId;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  mediaUrls: string[];
  tags: string[];
}
