import { GetPortfolioProjectsUseCase } from "@/modules/portfolio/application/use-cases/GetPortfolioProjectsUseCase";
import { createProjectRepository } from "@/modules/portfolio/infrastructure/factories/createProjectRepository";
import { portfolioOwnerProfile } from "@/modules/portfolio/infrastructure/data/portfolioOwnerProfile";
import { ContactSection } from "@/modules/portfolio/presentation/components/ContactSection";
import { PortfolioHeaderSection } from "@/modules/portfolio/presentation/components/PortfolioHeaderSection";
import { ProjectsShowcaseSection } from "@/modules/portfolio/presentation/components/ProjectsShowcaseSection";
import { mapProjectToCardViewModel } from "@/modules/portfolio/presentation/mappers/projectViewModelMapper";

export default async function HomePage() {
  const projectRepository = createProjectRepository();
  const getPortfolioProjectsUseCase = new GetPortfolioProjectsUseCase(projectRepository);

  const projects = await getPortfolioProjectsUseCase.execute();
  const projectCards = projects.map(mapProjectToCardViewModel);

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

        <footer className="border-t border-[var(--color-border)] pt-8 pb-2 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-text)]">
            {portfolioOwnerProfile.ownerName}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </main>
  );
}
