import type { ProjectRepository } from "../../domain/repositories/ProjectRepository";
import { FirebaseProjectRepository } from "../adapters/firebase/FirebaseProjectRepository";
import { InMemoryProjectRepository } from "../adapters/in-memory/InMemoryProjectRepository";
import { seedProjects } from "../data/seedProjects";

function hasFirebaseConfiguration(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  );
}

export function createProjectRepository(): ProjectRepository {
  if (hasFirebaseConfiguration()) {
    return new FirebaseProjectRepository();
  }

  return new InMemoryProjectRepository(seedProjects);
}
