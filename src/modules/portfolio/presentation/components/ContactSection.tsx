import { IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";
import Link from "next/link";

interface ContactSectionProps {
  ownerName: string;
  whatsappUrl: string;
  instagramUrl: string;
}

export function ContactSection({
  ownerName,
  whatsappUrl,
  instagramUrl,
}: ContactSectionProps) {
  return (
    <section className="px-1 py-2 md:px-2">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ui-text-muted">
        Contato
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-ui-text md:text-4xl">
        Vamos criar algo juntos?
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ui-text-muted">
        Entre em contato com {ownerName} para discutir seu proximo projeto de design,
        branding ou produto digital.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ui-accent px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ui-accent-contrast transition hover:opacity-90"
        >
          <IconBrandWhatsapp size={18} stroke={1.9} aria-hidden />
          Falar no WhatsApp
        </Link>

        <Link
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ui-border px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ui-text transition hover:bg-white/10"
        >
          <IconBrandInstagram size={18} stroke={1.9} aria-hidden />
          Instagram
        </Link>
      </div>
    </section>
  );
}
