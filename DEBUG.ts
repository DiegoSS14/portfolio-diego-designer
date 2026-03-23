/**
 * ARQUIVO PARA DEBUG
 * 
 * Descomente as linhas abaixo e rode no seu projeto para ver
 * exatamente o que está vindo do Firebase
 */

// 1. Teste na home page - veja todos os projetos
// Adicione isto em src/app/page.tsx na função loadHomePageData():
/*
  const projects = await getPortfolioProjectsUseCase.execute();
  console.log("🔍 PROJETOS DO FIREBASE:", JSON.stringify(projects, null, 2));
  projects.forEach((p) => {
    console.log(`  - Título: ${p.title}`);
    console.log(`    Tags: ${JSON.stringify(p.tags)}`);
    console.log(`    Media URLs: ${JSON.stringify(p.mediaUrls)}`);
  });
*/

// 2. Teste na página de detalhes - veja um projeto específico
// Adicione isto em src/app/projetos/[slug]/page.tsx na função loadProjectDetailsPageData():
/*
  const project = await getProjectBySlugUseCase.execute(slug);
  if (project) {
    console.log("🔍 PROJETO ENCONTRADO:", JSON.stringify(project, null, 2));
    console.log(`  - ID: ${project.id}`);
    console.log(`  - Slug: ${project.slug}`);
    console.log(`  - Título: ${project.title}`);
    console.log(`  - Tags: ${JSON.stringify(project.tags)}`);
    console.log(`  - Media URLs: ${JSON.stringify(project.mediaUrls)}`);
    console.log(`  - Thumbnail: ${project.thumbnailUrl}`);
  } else {
    console.log("❌ Projeto não encontrado!");
  }
*/

// 3. Verifique no navegador:
// - Abra DevTools (F12)
// - Vá em Console ou Network
// - Os logs acima aparecerão lá

// 4. Problemas esperados:
// - tags: undefined ou [] (vazio)
// - mediaUrls: undefined ou [] (vazio)
// - thumbnailUrl: vazio ou undefined

// 5. Solução:
// Se tags/mediaUrls estiverem undefined, é porque:
//   A) Não foram salvos no Firebase
//   B) Foram salvos com outro nome de campo
//   C) Foram salvos como string em vez de array
