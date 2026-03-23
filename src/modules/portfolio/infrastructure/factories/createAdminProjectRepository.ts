import type { ProjectRepository } from "../../domain/repositories/ProjectRepository";
import { FirebaseAdminProjectRepository } from "../adapters/firebase-admin/FirebaseAdminProjectRepository";

export function createAdminProjectRepository(): ProjectRepository {
  return new FirebaseAdminProjectRepository();
}
