import type { Project } from "../../domain/entities/Project";

/**
 * EXEMPLO DE COMO USAR A NOVA ESTRUTURA DE PASTAS
 * 
 * Localizações das imagens:
 * /public/projects/rebranding-zenith-coffee/
 *   ├── thumbnail.webp
 *   └── gallery/
 *       ├── hero.webp
 *       ├── color-palette.webp
 *       └── applications.webp
 */

export const seedProjectsExemplo: Project[] = [
  {
    id: "brand-zenith",
    slug: "rebranding-zenith-coffee",
    title: "Rebranding Zenith Coffee",
    shortDescription:
      "Sistema visual completo para uma cafeteria premium, com direção de arte, social e embalagens.",
    fullDescription:
      "Projeto de reposicionamento de marca para a Zenith Coffee, focado em sofisticação e memorabilidade. Foram entregues novo logotipo, paleta, linguagem visual para redes sociais e aplicações em embalagem.",
    // A thumbnail SEMPRE fica na raiz da pasta do projeto
    thumbnailUrl: "/projects/rebranding-zenith-coffee/thumbnail.webp",
    // Todas as imagens internas ficam em /gallery
    mediaUrls: [
      "/projects/rebranding-zenith-coffee/gallery/hero.webp",
      "/projects/rebranding-zenith-coffee/gallery/color-palette.webp",
      "/projects/rebranding-zenith-coffee/gallery/applications.webp",
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
    thumbnailUrl: "/projects/design-system-lumen-app/thumbnail.webp",
    mediaUrls: [
      "/projects/design-system-lumen-app/gallery/components.webp",
      "/projects/design-system-lumen-app/gallery/tokens.webp",
      "/projects/design-system-lumen-app/gallery/documentation.webp",
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
    thumbnailUrl: "/projects/campanha-atelier-viva/thumbnail.webp",
    mediaUrls: [
      "/projects/campanha-atelier-viva/gallery/key-visual.webp",
      "/projects/campanha-atelier-viva/gallery/landing-page.webp",
      "/projects/campanha-atelier-viva/gallery/social-media.webp",
    ],
    tags: ["Campanha", "Midias Sociais", "Motion"],
  },
];
