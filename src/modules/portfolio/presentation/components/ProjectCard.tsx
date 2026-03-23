import Image from "next/image";
import Link from "next/link";

import type { ProjectCardViewModel } from "../view-models/ProjectCardViewModel";

interface ProjectCardProps {
  project: ProjectCardViewModel;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-ui-border bg-ui-surface/50 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
      <Link href={`/projetos/${project.slug}`}>
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <Image
            src={project.thumbnailUrl}
            alt={`Miniatura do projeto ${project.title}`}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="space-y-4 p-6">
          <h3 className="text-2xl font-semibold text-ui-text">{project.title}</h3>
          <p className="text-base leading-relaxed text-ui-text-muted">
            {project.shortDescription}
          </p>

          <ul className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-ui-border px-3 py-1 text-xs uppercase tracking-[0.14em] text-ui-text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
}
