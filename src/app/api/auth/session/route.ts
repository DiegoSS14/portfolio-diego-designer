import { createAuthDependencies } from "@/modules/auth/infrastructure/factories/createAuthDependencies";

export const runtime = "nodejs";

interface SessionRequestBody {
  idToken?: string;
}

export async function GET() {
  const { getCurrentAdminSessionUseCase } = createAuthDependencies();
  const session = await getCurrentAdminSessionUseCase.execute();

  if (!session) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  return Response.json({
    authenticated: true,
    session: {
      uid: session.uid,
      email: session.email,
      isAdmin: session.isAdmin,
      expiresAt: session.expiresAt,
    },
  });
}

export async function POST(request: Request) {
  const requestBody = (await request.json()) as SessionRequestBody;

  if (!requestBody.idToken) {
    return Response.json({ error: "idToken is required" }, { status: 400 });
  }

  const { startAdminSessionUseCase } = createAuthDependencies();
  const session = await startAdminSessionUseCase.execute({ idToken: requestBody.idToken });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({
    authenticated: true,
    session: {
      uid: session.uid,
      email: session.email,
      isAdmin: session.isAdmin,
      expiresAt: session.expiresAt,
    },
  });
}

export async function DELETE() {
  const { endAdminSessionUseCase } = createAuthDependencies();
  await endAdminSessionUseCase.execute();

  return Response.json({ authenticated: false });
}
