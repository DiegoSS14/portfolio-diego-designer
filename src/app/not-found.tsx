import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-ui-text-muted">404</p>
      <h1 className="text-4xl font-semibold text-ui-text">Projeto nao encontrado</h1>
      <p className="max-w-xl text-lg text-ui-text-muted">
        O projeto que voce tentou acessar nao existe ou foi removido do portfolio.
      </p>
      <Link
        href="/"
        className="rounded-full border border-ui-border px-6 py-3 text-sm uppercase tracking-[0.15em] text-ui-text transition hover:bg-ui-surface-strong"
      >
        Voltar para a home
      </Link>
    </main>
  );
}
