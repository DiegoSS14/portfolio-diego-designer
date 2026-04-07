import { revalidatePath, revalidateTag } from "next/cache";

import { DeleteProjectUseCase } from "@/modules/portfolio/application/use-cases/DeleteProjectUseCase";
import { UpdateProjectUseCase } from "@/modules/portfolio/application/use-cases/UpdateProjectUseCase";
import {
  createProjectUpsertPayload,
  type RawProjectPayload,
} from "@/modules/portfolio/application/use-cases/UpsertProjectPayloadFactory";
import { createAdminProjectRepository } from "@/modules/portfolio/infrastructure/factories/createAdminProjectRepository";
import { requireAdminSession } from "@/modules/auth/presentation/server/requireAdminSession";

export const runtime = "nodejs";
const PROJECTS_CACHE_TAG = "projects";

function invalidatePath(path: string) {
  if (typeof revalidatePath === "function") {
    revalidatePath(path);
  }
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const adminSession = await requireAdminSession();

  if (!adminSession) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as RawProjectPayload;

  try {
    const payload = createProjectUpsertPayload(body);
    const repository = createAdminProjectRepository();
    const updateProjectUseCase = new UpdateProjectUseCase(repository);
    const updatedProject = await updateProjectUseCase.execute(id, payload);

    if (!updatedProject) {
      return Response.json({ error: "Project not found." }, { status: 404 });
    }

    invalidatePath("/");
    invalidatePath(`/projetos/${updatedProject.slug}`);
    revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });

    return Response.json({ project: updatedProject });
  } catch {
    return Response.json({ error: "Invalid project payload." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const adminSession = await requireAdminSession();

  if (!adminSession) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const repository = createAdminProjectRepository();
  const deleteProjectUseCase = new DeleteProjectUseCase(repository);
  const removed = await deleteProjectUseCase.execute(id);

  if (!removed) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }

  invalidatePath("/");
  revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });

  return Response.json({ removed: true });
}
