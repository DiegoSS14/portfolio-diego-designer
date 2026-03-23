# Portfolio Designer (Next.js + DDD + Clean Architecture)

Site de portfolio para designer com tema escuro/claro, secao de projetos e pagina de detalhes por projeto.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Firebase Firestore (via adaptador)

## Como rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## Variaveis de ambiente (Firebase)

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

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
- Fabrica de selecao: `createProjectRepository`

Essa estrutura permite trocar Firebase por qualquer outro provedor sem alterar os casos de uso.

## Adaptar para portfolio de desenvolvedor

Voce pode manter a arquitetura e alterar apenas o conteudo:

- Perfil: `src/modules/portfolio/infrastructure/data/portfolioOwnerProfile.ts`
- Projetos: `src/modules/portfolio/infrastructure/data/seedProjects.ts`

Assim, o site continua com o mesmo fluxo e componentes, mudando apenas os dados do dominio.
