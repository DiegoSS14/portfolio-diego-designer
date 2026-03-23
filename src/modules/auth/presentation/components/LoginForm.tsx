"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { IconLogin2 } from "@tabler/icons-react";

import { getFirebaseAuthClient } from "@/modules/portfolio/infrastructure/adapters/firebase/firebaseClient";

export function LoginForm() {
  const authClient = useMemo(() => getFirebaseAuthClient(), []);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const userCredential = await signInWithEmailAndPassword(authClient, email, password);
      const idToken = await userCredential.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        setErrorMessage("Voce nao possui permissao de administrador.");
        return;
      }

      router.push("/admin/projects");
      router.refresh();
    } catch {
      setErrorMessage("Falha no login. Verifique email e senha.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-ui-text-muted">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-ui-border bg-ui-surface px-4 py-3 text-sm text-ui-text outline-none transition focus:border-ui-accent"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-ui-text-muted">
          Senha
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-ui-border bg-ui-surface px-4 py-3 text-sm text-ui-text outline-none transition focus:border-ui-accent"
        />
      </div>

      {errorMessage ? (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-ui-accent bg-ui-accent px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ui-accent-contrast transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <IconLogin2 size={16} stroke={2} />
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
