import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-text-muted)]">404</p>
      <h1 className="text-4xl font-semibold text-[var(--color-text)]">Projeto nao encontrado</h1>
      <p className="max-w-xl text-lg text-[var(--color-text-muted)]">
        O projeto que voce tentou acessar nao existe ou foi removido do portfolio.
      </p>
      <Link
        href="/"
        className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm uppercase tracking-[0.15em] text-[var(--color-text)] transition hover:bg-[var(--color-surface-strong)]"
      >
        Voltar para a home
      </Link>
    </main>
  );
}
