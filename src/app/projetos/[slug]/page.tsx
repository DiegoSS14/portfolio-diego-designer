import { notFound } from "next/navigation";

import { GetProjectBySlugUseCase } from "@/modules/portfolio/application/use-cases/GetProjectBySlugUseCase";
import { isFirebaseServiceError } from "@/modules/portfolio/infrastructure/adapters/firebase/isFirebaseServiceError";
import { createProjectRepository } from "@/modules/portfolio/infrastructure/factories/createProjectRepository";
import { PortfolioMaintenanceSection } from "@/modules/portfolio/presentation/components/PortfolioMaintenanceSection";
import { ProjectDetailsSection } from "@/modules/portfolio/presentation/components/ProjectDetailsSection";
import { mapProjectToDetailsViewModel } from "@/modules/portfolio/presentation/mappers/projectViewModelMapper";

interface ProjectDetailsPageProps {
  params: Promise<{ slug: string }>;
}

type ProjectDetailsPageDataState =
  | {
      status: "ok";
      projectDetails: ReturnType<typeof mapProjectToDetailsViewModel>;
    }
  | {
      status: "not-found";
    }
  | {
      status: "maintenance";
    };

async function loadProjectDetailsPageData(slug: string): Promise<ProjectDetailsPageDataState> {
  const projectRepository = createProjectRepository();
  const getProjectBySlugUseCase = new GetProjectBySlugUseCase(projectRepository);

  try {
    const project = await getProjectBySlugUseCase.execute(slug);

    if (!project) {
      return { status: "not-found" };
    }

    return {
      status: "ok",
      projectDetails: mapProjectToDetailsViewModel(project),
    };
  } catch (error) {
    if (!isFirebaseServiceError(error)) {
      throw error;
    }

    return { status: "maintenance" };
  }
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { slug } = await params;
  const dataState = await loadProjectDetailsPageData(slug);

  if (dataState.status === "not-found") {
    notFound();
  }

  if (dataState.status === "maintenance") {
    return (
      <main className="relative flex-1">
        <PortfolioMaintenanceSection
          title="Pagina temporariamente indisponivel"
          message="Nao foi possivel carregar os detalhes deste projeto agora. Em breve o servico sera restabelecido."
        />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 md:px-12 md:py-20">
      <ProjectDetailsSection project={dataState.projectDetails} />
    </main>
  );
}
