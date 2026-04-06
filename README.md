# Portfolio Designer (Next.js + DDD + Clean Architecture)

Site de portfolio para designer com area publica de projetos e fluxo administrativo completo para criacao, edicao e remocao de projetos.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Firebase Firestore (via adaptador)
- Firebase Storage (midias e thumbs)
- Jest + Testing Library (unitario e integracao)

## Principais features

- Listagem de projetos ordenada por recencia (`updatedAt` e fallback em `createdAt`).
- Pagina de detalhes por slug com galeria em altura natural de imagem.
- Login administrativo por sessao (cookies assinados).
- CRUD administrativo de projetos.
- Botoes de editar/excluir direto na pagina de detalhes quando autenticado.
- Confirmacao de exclusao via modal na pagina de detalhes.
- Upload de imagens com:
	- preservacao da ordem de selecao,
	- otimizacao client-side (WebP quando vantajoso),
	- fallback seguro para geracao de IDs quando `crypto.randomUUID` nao existir.
- Reordenacao de midias no admin:
	- drag and drop,
	- controles de subir/descer,
	- remocao com opcao de desfazer.

## Testes

- Suite movida para fora de `src`, em `tests/`.
- Cobertura de integracao para rotas:
	- `api/admin/projects`
	- `api/admin/projects/[id]`
	- `api/auth/session`
- Cobertura unitaria para:
	- fabrica de payload,
	- repositorio in-memory,
	- fabrica de repositorio,
	- componentes de apresentacao com interacao.

Comandos:

```bash
npm test
npm run test:watch
npm run test:coverage
```

## Como rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

Para acesso em rede local (LAN), use:

```bash
npm run dev:lan
```

## Variaveis de ambiente (Firebase)

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
AUTH_SESSION_SECRET=
AUTH_ADMIN_UIDS=
AUTH_ADMIN_EMAILS=
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

Sobre autenticacao administrativa:

- `AUTH_SESSION_SECRET`: segredo para assinar cookie de sessao (minimo 16 caracteres).
- `AUTH_ADMIN_UIDS`: lista de UIDs Firebase com permissao de admin, separados por virgula.
- `AUTH_ADMIN_EMAILS`: lista de emails com permissao de admin, separados por virgula.
- `FIREBASE_ADMIN_PROJECT_ID`: project id da service account.
- `FIREBASE_ADMIN_CLIENT_EMAIL`: client email da service account.
- `FIREBASE_ADMIN_PRIVATE_KEY`: private key da service account (com `\n` nas quebras de linha).

Se as variaveis nao forem definidas, o sistema usa automaticamente o adaptador in-memory com dados locais.

## Arquitetura

O projeto segue separacao por dominio com principios de DDD e Clean Architecture:

```text
src/
	app/
	modules/
		portfolio/
			domain/
				entities/
				repositories/         # Portas
			application/
				use-cases/
			infrastructure/
				adapters/
					firebase/           # Adaptador externo
					in-memory/          # Adaptador fallback
				data/
				factories/
			presentation/
				components/
				mappers/
				view-models/
	shared/
```

### Portas e adaptadores

- Porta principal: `ProjectRepository`
- Adaptador 1: `FirebaseProjectRepository`
- Adaptador 2: `InMemoryProjectRepository`
- Adaptador administrativo: `FirebaseAdminProjectRepository`
- Fabrica de selecao publica: `createProjectRepository`
- Fabrica administrativa: `createAdminProjectRepository`

Essa estrutura permite trocar Firebase por qualquer outro provedor sem alterar os casos de uso.

## Adaptar para portfolio de desenvolvedor

Voce pode manter a arquitetura e alterar apenas o conteudo:

- Perfil: `src/modules/portfolio/infrastructure/data/portfolioOwnerProfile.ts`
- Projetos: `src/modules/portfolio/infrastructure/data/seedProjects.ts`

Assim, o site continua com o mesmo fluxo e componentes, mudando apenas os dados do dominio.
