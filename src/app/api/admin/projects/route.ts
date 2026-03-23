import { revalidateTag } from "next/cache";

import { CreateProjectUseCase } from "@/modules/portfolio/application/use-cases/CreateProjectUseCase";
import { GetPortfolioProjectsUseCase } from "@/modules/portfolio/application/use-cases/GetPortfolioProjectsUseCase";
import {
  createProjectUpsertPayload,
  type RawProjectPayload,
} from "@/modules/portfolio/application/use-cases/UpsertProjectPayloadFactory";
import { createAdminProjectRepository } from "@/modules/portfolio/infrastructure/factories/createAdminProjectRepository";
import { requireAdminSession } from "@/modules/auth/presentation/server/requireAdminSession";

export const runtime = "nodejs";
const PROJECTS_CACHE_TAG = "projects";

export async function GET() {
  const adminSession = await requireAdminSession();

  if (!adminSession) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repository = createAdminProjectRepository();
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
    const repository = createAdminProjectRepository();
    const createProjectUseCase = new CreateProjectUseCase(repository);
    const createdProject = await createProjectUseCase.execute(payload);
    revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });

    return Response.json({ project: createdProject }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid project payload." }, { status: 400 });
  }
}
