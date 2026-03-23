import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

import { LoginForm } from "@/modules/auth/presentation/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center px-6 py-16 md:px-12">
      <Link
        href="/"
        className="fixed top-5 left-5 z-50 inline-flex items-center gap-2 rounded-xl border border-ui-border bg-ui-bg px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ui-text-muted transition hover:text-ui-text md:top-8 md:left-8"
      >
        <IconArrowLeft size={14} />
        Voltar
      </Link>

      <section className="w-full max-w-md rounded-3xl border border-ui-border bg-ui-surface/80 p-6 shadow-[0_18px_54px_rgba(0,0,0,0.22)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ui-text-muted">Acesso Restrito</p>
        <h1 className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-ui-text">
          Login Admin
        </h1>
        <p className="mt-3 mb-6 text-sm text-ui-text-muted">
          Entre com a conta autorizada no Firebase para editar e publicar projetos.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}
