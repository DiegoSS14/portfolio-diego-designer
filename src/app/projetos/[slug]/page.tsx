import { notFound } from "next/navigation";

import { GetProjectBySlugUseCase } from "@/modules/portfolio/application/use-cases/GetProjectBySlugUseCase";
import { createProjectRepository } from "@/modules/portfolio/infrastructure/factories/createProjectRepository";
import { ProjectDetailsSection } from "@/modules/portfolio/presentation/components/ProjectDetailsSection";
import { mapProjectToDetailsViewModel } from "@/modules/portfolio/presentation/mappers/projectViewModelMapper";

interface ProjectDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { slug } = await params;
  const projectRepository = createProjectRepository();
  const getProjectBySlugUseCase = new GetProjectBySlugUseCase(projectRepository);

  const project = await getProjectBySlugUseCase.execute(slug);

  if (!project) {
    notFound();
  }

  const projectDetails = mapProjectToDetailsViewModel(project);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 md:px-12 md:py-20">
      <ProjectDetailsSection project={projectDetails} />
    </main>
  );
}
