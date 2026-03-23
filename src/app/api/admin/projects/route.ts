import { CreateProjectUseCase } from "@/modules/portfolio/application/use-cases/CreateProjectUseCase";
import { GetPortfolioProjectsUseCase } from "@/modules/portfolio/application/use-cases/GetPortfolioProjectsUseCase";
import {
  createProjectUpsertPayload,
  type RawProjectPayload,
} from "@/modules/portfolio/application/use-cases/UpsertProjectPayloadFactory";
import { createProjectRepository } from "@/modules/portfolio/infrastructure/factories/createProjectRepository";
import { requireAdminSession } from "@/modules/auth/presentation/server/requireAdminSession";

export const runtime = "nodejs";

export async function GET() {
  const adminSession = await requireAdminSession();

  if (!adminSession) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repository = createProjectRepository();
  const getProjectsUseCase = new GetPortfolioProjectsUseCase(repository);
  const projects = await getProjectsUseCase.execute();

  return Response.json({ projects });
}

export async function POST(request: Request) {
  const adminSession = await requireAdminSession();

  if (!adminSession) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as RawProjectPayload;

  try {
    const payload = createProjectUpsertPayload(body);
    const repository = createProjectRepository();
    const createProjectUseCase = new CreateProjectUseCase(repository);
    const createdProject = await createProjectUseCase.execute(payload);

    return Response.json({ project: createdProject }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid project payload." }, { status: 400 });
  }
}
