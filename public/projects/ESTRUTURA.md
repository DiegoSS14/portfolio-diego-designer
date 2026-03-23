# Estrutura de Armazenamento de Projetos

## Organização de Pastas

```
/public/projects/
├── exemplo-projeto-1/
│   ├── thumbnail.webp          (capa do projeto)
│   └── gallery/
│       ├── imagem-1.webp       (imagens internas)
│       ├── imagem-2.webp
│       └── ...
├── exemplo-projeto-2/
│   ├── thumbnail.webp
│   └── gallery/
│       └── ...
└── seu-projeto-slug/
    ├── thumbnail.webp
    └── gallery/
        └── ...
```

## Formato do Objeto no Firebase

Para cada projeto que você salvar, use este padrão de URLs:

```typescript
{
  id: "uuid-unico",
  slug: "seu-projeto-slug",                    // kebab-case, único
  title: "Título do Projeto",
  shortDescription: "Descrição breve...",
  fullDescription: "Descrição detalhada...",
  
  // CAMINHO DA THUMBNAIL (sempre na raiz da pasta do projeto)
  thumbnailUrl: "/projects/seu-projeto-slug/thumbnail.webp",
  
  // CAMINHOS DAS IMAGENS INTERNAS (todas em /gallery)
  mediaUrls: [
    "/projects/seu-projeto-slug/gallery/imagem-1.webp",
    "/projects/seu-projeto-slug/gallery/imagem-2.webp",
    "/projects/seu-projeto-slug/gallery/imagem-3.webp"
  ],
  
  tags: ["design", "web", "responsive"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
```

## Passo a Passo para Adicionar um Novo Projeto

### 1. Criar Pastas
```
public/projects/meu-novo-projeto/               ← slug do projeto
public/projects/meu-novo-projeto/gallery/       ← subpasta para imagens internas
```

### 2. Adicionar Imagens
- `meu-novo-projeto/thumbnail.webp` - sua capa/thumbnail
- `meu-novo-projeto/gallery/imagem-1.webp` - primeira imagem interna
- `meu-novo-projeto/gallery/imagem-2.webp` - segunda imagem interna
- etc...

### 3. Criar Objeto e Salvar no Firebase
```typescript
const novoProj = {
  id: "seu-uuid",
  slug: "meu-novo-projeto",
  title: "Título do Meu Projeto",
  shortDescription: "...",
  fullDescription: "...",
  thumbnailUrl: "/projects/meu-novo-projeto/thumbnail.webp",
  mediaUrls: [
    "/projects/meu-novo-projeto/gallery/imagem-1.webp",
    "/projects/meu-novo-projeto/gallery/imagem-2.webp"
  ],
  tags: ["tag1", "tag2"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// Salvar no Firebase Firestore na collection 'projects'
// com ID do documento = id do objeto (ou deixar gerar automático)
```

## Recomendações de Imagem

- **Formato**: WebP (melhor compressão) ou JPEG (fallback)
- **Thumbnail**: 1600×1200px (proporção 4:3)
- **Imagens da Gallery**: 1600×1200px ou mesma proporção 4:3
- **Otimizar**: Comprimir antes de colocar em `/public` para reduzir bundle

## Integração com Código

As imagens em `/public` são entregues automaticamente pelo Next.js sem processamento.
Você pode usar com `<Image>` component ou simples `<img>`:

```tsx
<img 
  src="/projects/seu-projeto-slug/thumbnail.webp" 
  alt="Projeto" 
/>

// ou com next/image
<Image
  src="/projects/seu-projeto-slug/thumbnail.webp"
  alt="Projeto"
  width={1600}
  height={1200}
/>
```

## Exemplo Concreto

Para um projeto chamado "Landing Page Ecommerce":

```
/public/projects/landing-ecommerce/
├── thumbnail.webp
└── gallery/
    ├── hero-section.webp
    ├── products-grid.webp
    ├── checkout-flow.webp
    └── footer.webp
```

Objeto no Firebase:
```json
{
  "id": "proj-001",
  "slug": "landing-ecommerce",
  "title": "Landing Page Ecommerce",
  "shortDescription": "Landing page responsiva para e-commerce com checkout integrado",
  "fullDescription": "Projeto desenvolvido em React + Tailwind...",
  "thumbnailUrl": "/projects/landing-ecommerce/thumbnail.webp",
  "mediaUrls": [
    "/projects/landing-ecommerce/gallery/hero-section.webp",
    "/projects/landing-ecommerce/gallery/products-grid.webp",
    "/projects/landing-ecommerce/gallery/checkout-flow.webp",
    "/projects/landing-ecommerce/gallery/footer.webp"
  ],
  "tags": ["react", "tailwind", "ecommerce", "responsive"],
  "createdAt": "2026-03-23T10:00:00Z",
  "updatedAt": "2026-03-23T10:00:00Z"
}
```

---

**Resumo**: Cada projeto tem sua própria pasta em `/public/projects/[slug]/`, com a thumbnail na raiz e as imagens internas em `gallery/`. O objeto no Firebase referencia esses caminhos absolutos (iniciando com `/`).
