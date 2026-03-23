export interface ProjectCardViewModel {
  slug: string;
  title: string;
  shortDescription: string;
  thumbnailUrl: string;
  tags: string[];
}

export interface ProjectDetailsViewModel {
  title: string;
  fullDescription: string;
  mediaUrls: string[];
  tags: string[];
}
