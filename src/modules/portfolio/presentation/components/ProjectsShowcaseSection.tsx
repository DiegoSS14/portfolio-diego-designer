import type { ProjectCardViewModel } from "../view-models/ProjectCardViewModel";
import { ProjectCard } from "./ProjectCard";

interface ProjectsShowcaseSectionProps {
  projects: ProjectCardViewModel[];
}

export function ProjectsShowcaseSection({
  projects,
}: ProjectsShowcaseSectionProps) {
  return (
    <section id="projetos" className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ui-text-muted">
          Trabalhos em destaque
        </p>
        <h2 className="text-3xl font-semibold text-ui-text md:text-4xl">
          Projetos selecionados
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-ui-text-muted md:text-lg">
          Cada projeto foi pensado para equilibrar estrategia, estetica e impacto no
          resultado do cliente.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
