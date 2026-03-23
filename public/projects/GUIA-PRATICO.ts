// GUIA PRÁTICO: Como criar um novo projeto com a estrutura de pastas

/**
 * PASSO 1: Estrutura de pasta
 * 
 * Crie uma pasta em public/projects/ com o slug do seu projeto:
 * 
 *   public/projects/seu-projeto-slug/
 *   ├── thumbnail.webp          (imagem de capa - 1600x1200px)
 *   └── gallery/
 *       ├── imagem-1.webp       (imagens internas)
 *       ├── imagem-2.webp
 *       └── imagem-3.webp
 */

/**
 * PASSO 2: Criar o objeto do projeto
 * 
 * Cole este template e preencha com seus dados:
 */

const meuNovoProj = {
  id: "seu-id-unico", // pode ser UUID (v4) ou slug transformado
  slug: "seu-projeto-slug", // ÚNICO, em kebab-case
  title: "Título do Projeto",
  shortDescription: "Uma frase curta descrevendo o projeto (para cards)",
  fullDescription: "Um parágrafo ou mais descrevendo detalhes, processo, resultado...",

  // PADRÃO DE CAMINHO:
  // - Sempre começa com /projects/
  // - Depois vem o slug do projeto (deve coincidir com a pasta)
  // - Thumbnail SEMPRE fica na raiz: /projects/slug/thumbnail.webp
  thumbnailUrl: "/projects/seu-projeto-slug/thumbnail.webp",

  // Imagens internas SEMPRE ficam em /gallery:
  // - /projects/slug/gallery/nome-da-imagem.webp
  mediaUrls: [
    "/projects/seu-projeto-slug/gallery/imagem-1.webp",
    "/projects/seu-projeto-slug/gallery/imagem-2.webp",
    "/projects/seu-projeto-slug/gallery/imagem-3.webp",
  ],

  tags: ["tag1", "tag2", "tag3"], // categorias do projeto
};

/**
 * PASSO 3: Salvar no Firebase
 * 
 * Opções:
 * 
 * A) Via Firestore Console (manual):
 *    1. Acesse: https://console.firebase.google.com
 *    2. Firestore Database → collection "projects"
 *    3. Add document → ID: uid ou deixar gerar automático
 *    4. Cole os dados acima
 * 
 * B) Via código (se tiver SDK configurado):
 *    import { collection, addDoc } from "firebase/firestore";
 *    import { db } from "@/modules/portfolio/infrastructure/adapters/firebase/firebaseClient";
 *    
 *    await addDoc(collection(db, "projects"), meuNovoProj);
 */

/**
 * EXEMPLO COMPLETO: Landing Page E-commerce
 */

const exemploCompleto = {
  id: "proj-001",
  slug: "landing-ecommerce-fashion",
  title: "Landing Page E-commerce Fashion",
  shortDescription: "Landing page responsiva para loja de moda com catálogo dinâmico e checkout otimizado",
  fullDescription:
    "Projeto desenvolvido em React + Tailwind CSS, com foco em UX para conversão. Inclui galeria de produtos interativa, carrinho persistente em localStorage, e integração com API de pagamento. Responsivo para mobile, tablet e desktop.",

  // Estrutura de pasta esperada:
  // public/projects/landing-ecommerce-fashion/
  //   ├── thumbnail.webp (screenshot da homepage)
  //   └── gallery/
  //       ├── hero-section.webp
  //       ├── products-grid.webp
  //       ├── product-details.webp
  //       └── checkout-flow.webp

  thumbnailUrl: "/projects/landing-ecommerce-fashion/thumbnail.webp",
  mediaUrls: [
    "/projects/landing-ecommerce-fashion/gallery/hero-section.webp",
    "/projects/landing-ecommerce-fashion/gallery/products-grid.webp",
    "/projects/landing-ecommerce-fashion/gallery/product-details.webp",
    "/projects/landing-ecommerce-fashion/gallery/checkout-flow.webp",
  ],
  tags: ["React", "Tailwind", "E-commerce", "Responsive", "UX Design"],
};

/**
 * RECOMENDAÇÕES DE IMAGEM
 */

/**
 * Tamanho: 1600×1200 pixels (proporção 4:3)
 * - Garante qualidade em qualquer tela
 * - Proporção padrão para web
 * 
 * Formato: WebP
 * - 60-70% mais compacto que JPEG
 * - Suporte universal em navegadores modernos
 * - Se precisar fallback: JPEG como alternativa
 * 
 * Compressão:
 * - Use Tinify (https://tinypng.com) ou similar
 * - Alvo: <300KB por imagem
 * 
 * Nomes:
 * - Use kebab-case: hero-section.webp (não heroDection.webp)
 * - Descritivo do conteúdo
 */

/**
 * CHECKLIST ANTES DE SALVAR
 */

/*
  ✓ Pasta criada em /public/projects/seu-slug/
  ✓ Arquivo thumbnail.webp adicionado
  ✓ Subpasta /gallery criada
  ✓ Imagens em .webp ou .jpg adicionadas em /gallery
  ✓ Nome do slug é único (sem repetição)
  ✓ Slug usa apenas letras, números e hífen (kebab-case)
  ✓ Slug no objeto === slug na pasta (/projects/seu-slug/)
  ✓ thumbnailUrl começa com /projects/seu-slug/thumbnail.webp
  ✓ Cada URL em mediaUrls começa com /projects/seu-slug/gallery/
  ✓ Tags preenchidas (mínimo 3)
  ✓ shortDescription tem 1-2 linhas
  ✓ fullDescription tem detalhe suficiente
*/

export { meuNovoProj, exemploCompleto };
