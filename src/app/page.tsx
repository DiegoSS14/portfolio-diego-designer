import { unstable_cache } from "next/cache";

import { GetPortfolioProjectsUseCase } from "@/modules/portfolio/application/use-cases/GetPortfolioProjectsUseCase";
import { isFirebaseServiceError } from "@/modules/portfolio/infrastructure/adapters/firebase/isFirebaseServiceError";
import { InMemoryProjectRepository } from "@/modules/portfolio/infrastructure/adapters/in-memory/InMemoryProjectRepository";
import { createProjectRepository } from "@/modules/portfolio/infrastructure/factories/createProjectRepository";
import { createAdminProjectRepository } from "@/modules/portfolio/infrastructure/factories/createAdminProjectRepository";
import { portfolioOwnerProfile } from "@/modules/portfolio/infrastructure/data/portfolioOwnerProfile";
import { seedProjects } from "@/modules/portfolio/infrastructure/data/seedProjects";
import { ContactSection } from "@/modules/portfolio/presentation/components/ContactSection";
import { PortfolioMaintenanceSection } from "@/modules/portfolio/presentation/components/PortfolioMaintenanceSection";
import { PortfolioHeaderSection } from "@/modules/portfolio/presentation/components/PortfolioHeaderSection";
import { ProjectsShowcaseSection } from "@/modules/portfolio/presentation/components/ProjectsShowcaseSection";
import { mapProjectToCardViewModel } from "@/modules/portfolio/presentation/mappers/projectViewModelMapper";

interface HomePageDataState {
  projectCards: ReturnType<typeof mapProjectToCardViewModel>[];
  isMaintenanceMode: boolean;
}

const PROJECTS_CACHE_TAG = "projects";

async function loadHomePageData(): Promise<HomePageDataState> {
  const projectRepository = createProjectRepository();
  const getPortfolioProjectsUseCase = new GetPortfolioProjectsUseCase(projectRepository);

  try {
    const projects = await getPortfolioProjectsUseCase.execute();

    return {
      projectCards: projects.map(mapProjectToCardViewModel),
      isMaintenanceMode: false,
    };
  } catch (error) {
    if (!isFirebaseServiceError(error)) {
      throw error;
    }

    try {
      const adminRepository = createAdminProjectRepository();
      const adminUseCase = new GetPortfolioProjectsUseCase(adminRepository);
      const adminProjects = await adminUseCase.execute();

      return {
        projectCards: adminProjects.map(mapProjectToCardViewModel),
        isMaintenanceMode: false,
      };
    } catch {
      // If both public and server reads fail, keep public portfolio online with local seed data.
    }

    const fallbackRepository = new InMemoryProjectRepository(seedProjects);
    const fallbackUseCase = new GetPortfolioProjectsUseCase(fallbackRepository);
    const fallbackProjects = await fallbackUseCase.execute();

    return {
      projectCards: fallbackProjects.map(mapProjectToCardViewModel),
      isMaintenanceMode: false,
    };
  }
}

const loadHomePageDataFromCache = unstable_cache(
  async () => loadHomePageData(),
  ["home-page-data"],
  {
    tags: [PROJECTS_CACHE_TAG],
  },
);

export default async function HomePage() {
  const { projectCards, isMaintenanceMode } = await loadHomePageDataFromCache();

  if (isMaintenanceMode) {
    return (
      <main className="relative flex-1">
        <PortfolioMaintenanceSection />
      </main>
    );
  }

  return (
    <main className="relative flex-1">
      <section className="reveal-on-load">
        <PortfolioHeaderSection
          ownerName={portfolioOwnerProfile.ownerName}
          businessStatement={portfolioOwnerProfile.businessStatement}
          businessKeywords={portfolioOwnerProfile.businessKeywords}
        />
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 py-14 md:px-12 md:py-16">
        <section className="reveal-on-load reveal-delay-1">
          <ProjectsShowcaseSection projects={projectCards} />
        </section>
        <section className="reveal-on-load reveal-delay-2">
          <ContactSection
            ownerName={portfolioOwnerProfile.ownerName}
            whatsappUrl={portfolioOwnerProfile.whatsappUrl}
            instagramUrl={portfolioOwnerProfile.instagramUrl}
          />
        </section>

        <footer className="border-t border-ui-border pt-8 pb-2 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-ui-text">
            {portfolioOwnerProfile.ownerName}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ui-text-muted">
            Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </main>
  );
}
