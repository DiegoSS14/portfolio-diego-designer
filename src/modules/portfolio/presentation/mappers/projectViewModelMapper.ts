import type { Project } from "../../domain/entities/Project";
import type {
  ProjectCardViewModel,
  ProjectDetailsViewModel,
} from "../view-models/ProjectCardViewModel";

export function mapProjectToCardViewModel(project: Project): ProjectCardViewModel {
  return {
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    thumbnailUrl: project.thumbnailUrl,
    tags: project.tags,
  };
}

export function mapProjectToDetailsViewModel(project: Project): ProjectDetailsViewModel {
  return {
    title: project.title,
    fullDescription: project.fullDescription,
    mediaUrls: project.mediaUrls,
    tags: project.tags,
  };
}
