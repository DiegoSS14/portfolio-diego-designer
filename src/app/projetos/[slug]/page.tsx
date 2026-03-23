import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

import { GetProjectBySlugUseCase } from "@/modules/portfolio/application/use-cases/GetProjectBySlugUseCase";
import { isFirebaseServiceError } from "@/modules/portfolio/infrastructure/adapters/firebase/isFirebaseServiceError";
import { InMemoryProjectRepository } from "@/modules/portfolio/infrastructure/adapters/in-memory/InMemoryProjectRepository";
import { seedProjects } from "@/modules/portfolio/infrastructure/data/seedProjects";
import { createAdminProjectRepository } from "@/modules/portfolio/infrastructure/factories/createAdminProjectRepository";
import { createProjectRepository } from "@/modules/portfolio/infrastructure/factories/createProjectRepository";
import { PortfolioMaintenanceSection } from "@/modules/portfolio/presentation/components/PortfolioMaintenanceSection";
import { ProjectDetailsSection } from "@/modules/portfolio/presentation/components/ProjectDetailsSection";
import { mapProjectToDetailsViewModel } from "@/modules/portfolio/presentation/mappers/projectViewModelMapper";

interface ProjectDetailsPageProps {
  params: Promise<{ slug: string }>;
}

const PROJECTS_CACHE_TAG = "projects";

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

    try {
      const adminRepository = createAdminProjectRepository();
      const adminUseCase = new GetProjectBySlugUseCase(adminRepository);
      const adminProject = await adminUseCase.execute(slug);

      if (adminProject) {
        return {
          status: "ok",
          projectDetails: mapProjectToDetailsViewModel(adminProject),
        };
      }
    } catch {
      // Continue to local fallback when server credentials are unavailable.
    }

    const fallbackRepository = new InMemoryProjectRepository(seedProjects);
    const fallbackUseCase = new GetProjectBySlugUseCase(fallbackRepository);
    const fallbackProject = await fallbackUseCase.execute(slug);

    if (!fallbackProject) {
      return { status: "not-found" };
    }

    return {
      status: "ok",
      projectDetails: mapProjectToDetailsViewModel(fallbackProject),
    };
  }
}

const loadProjectDetailsPageDataFromCache = unstable_cache(
  async (slug: string) => loadProjectDetailsPageData(slug),
  ["project-details-page-data"],
  {
    tags: [PROJECTS_CACHE_TAG],
  },
);

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { slug } = await params;
  const dataState = await loadProjectDetailsPageDataFromCache(slug);

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
