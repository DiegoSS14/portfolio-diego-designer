import { ThemeToggleButton } from "./ThemeToggleButton";

interface PortfolioHeaderSectionProps {
  ownerName: string;
  businessStatement: string;
  businessKeywords: string[];
}

export function PortfolioHeaderSection({
  ownerName,
  businessStatement,
  businessKeywords,
}: PortfolioHeaderSectionProps) {
  return (
    <header className="relative min-h-[56vh] w-full overflow-hidden md:min-h-[60vh]">
      <div className="relative mx-auto flex min-h-[56vh] w-full max-w-7xl flex-col justify-between px-6 py-6 md:min-h-[60vh] md:px-12 md:py-8">
        <div className="mb-10 flex items-start justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-ui-text-muted">
              Portfolio
            </p>
            <h1 className="font-sans text-xl font-semibold uppercase tracking-[0.18em] text-ui-text md:text-2xl">
              {ownerName}
            </h1>
          </div>
          <ThemeToggleButton />
        </div>

        <div className="space-y-10 pb-3 md:pb-6">
          <p className="max-w-6xl text-4xl leading-[1.02] font-medium uppercase tracking-[0.015em] text-ui-text md:text-7xl lg:text-8xl">
            {businessStatement}
          </p>

          <ul className="flex flex-wrap gap-3">
            {businessKeywords.map((keyword) => (
              <li
                key={keyword}
                className="rounded-full border border-ui-border bg-ui-surface/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ui-text-muted"
              >
                {keyword}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
