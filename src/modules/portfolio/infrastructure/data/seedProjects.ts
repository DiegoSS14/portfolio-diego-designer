import type { Project } from "../../domain/entities/Project";

export const seedProjects: Project[] = [
  {
    id: "brand-zenith",
    slug: "rebranding-zenith-coffee",
    title: "Rebranding Zenith Coffee",
    shortDescription:
      "Sistema visual completo para uma cafeteria premium, com direção de arte, social e embalagens.",
    fullDescription:
      "Projeto de reposicionamento de marca para a Zenith Coffee, focado em sofisticação e memorabilidade. Foram entregues novo logotipo, paleta, linguagem visual para redes sociais e aplicações em embalagem.",
    thumbnailUrl: "/projects/zenith-thumb.svg",
    mediaUrls: [
      "/projects/zenith-01.svg",
      "/projects/zenith-02.svg",
      "/projects/zenith-03.svg",
    ],
    tags: ["Branding", "Direcao de Arte", "Social Design"],
  },
  {
    id: "lumen-app",
    slug: "design-system-lumen-app",
    title: "Design System Lumen App",
    shortDescription:
      "Design system modular para produto digital com foco em consistencia visual e velocidade de evolucao.",
    fullDescription:
      "Construcao de um design system para o Lumen App com componentes reutilizaveis, tokens e documentacao para facilitar handoff entre design e desenvolvimento.",
    thumbnailUrl: "/projects/lumen-thumb.svg",
    mediaUrls: [
      "/projects/lumen-01.svg",
      "/projects/lumen-02.svg",
      "/projects/lumen-03.svg",
    ],
    tags: ["UI Design", "Design System", "Produto Digital"],
  },
  {
    id: "atelier-campaign",
    slug: "campanha-atelier-viva",
    title: "Campanha Atelier Viva",
    shortDescription:
      "Campanha multiformato para lancamento de colecao com narrativa visual e pecas para midias digitais.",
    fullDescription:
      "Direcao criativa para campanha de lancamento do Atelier Viva com key visual principal e desdobramentos para landing page, Instagram e anuncios em video curtos.",
    thumbnailUrl: "/projects/atelier-thumb.svg",
    mediaUrls: [
      "/projects/atelier-01.svg",
      "/projects/atelier-02.svg",
      "/projects/atelier-03.svg",
    ],
    tags: ["Campanha", "Midias Sociais", "Motion"],
  },
];
