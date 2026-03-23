interface PortfolioMaintenanceSectionProps {
  title?: string;
  message?: string;
}

export function PortfolioMaintenanceSection({
  title = "Estamos passando por uma instabilidade",
  message = "O acesso ao portifolio esta temporariamente indisponivel. Nossa equipe ja foi acionada e em breve o problema sera resolvido.",
}: PortfolioMaintenanceSectionProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 items-center px-6 py-16 md:px-12 md:py-24">
      <div className="w-full rounded-3xl border border-ui-border bg-ui-surface/75 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.16)] backdrop-blur-sm md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ui-text-muted">
          Status do sistema
        </p>
        <h1 className="mt-4 font-display text-3xl leading-tight text-ui-text md:text-4xl">{title}</h1>
        <p className="mt-5 text-base leading-relaxed text-ui-text-muted md:text-lg">{message}</p>
      </div>
    </section>
  );
}