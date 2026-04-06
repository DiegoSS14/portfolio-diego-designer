import type { Project } from "../../../domain/entities/Project";
import type {
  ProjectRepository,
  ProjectUpsertPayload,
} from "../../../domain/repositories/ProjectRepository";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestoreClient } from "@/modules/shared/infrastructure/adapters/firebase-admin/firebaseAdminClient";

const COLLECTION_NAME = "projects";

function normalizeDateValue(value: unknown): string | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const dateValue = value as { toDate?: () => Date };
    if (typeof dateValue.toDate === "function") {
      return dateValue.toDate().toISOString();
    }
  }

  return undefined;
}

function getProjectRecencyTimestamp(project: Project): number {
  const candidate = project.updatedAt ?? project.createdAt;

  if (!candidate) {
    return 0;
  }

  const parsed = Date.parse(candidate);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function mapProjectDocumentToDomain(
  id: string,
  data: FirebaseFirestore.DocumentData | undefined,
): Project {
  return {
    id,
    slug: String(data?.slug ?? ""),
    title: String(data?.title ?? ""),
    shortDescription: String(data?.shortDescription ?? ""),
    fullDescription: String(data?.fullDescription ?? ""),
    thumbnailUrl: String(data?.thumbnailUrl ?? ""),
    mediaUrls: Array.isArray(data?.mediaUrls)
      ? data.mediaUrls.map((mediaItem: unknown) => String(mediaItem))
      : [],
    tags: Array.isArray(data?.tags) ? data.tags.map((tagItem: unknown) => String(tagItem)) : [],
    createdAt: normalizeDateValue(data?.createdAt),
    updatedAt: normalizeDateValue(data?.updatedAt),
  };
}

export class FirebaseAdminProjectRepository implements ProjectRepository {
  async findAll(): Promise<Project[]> {
    const firestore = getFirebaseAdminFirestoreClient();
    const snapshot = await firestore.collection(COLLECTION_NAME).get();
    const projects = snapshot.docs.map((document) =>
      mapProjectDocumentToDomain(document.id, document.data()),
    );

    return projects.sort(
      (left, right) => getProjectRecencyTimestamp(right) - getProjectRecencyTimestamp(left),
    );
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const firestore = getFirebaseAdminFirestoreClient();
    const snapshot = await firestore
      .collection(COLLECTION_NAME)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    const first = snapshot.docs[0];

    if (!first) {
      return null;
    }

    return mapProjectDocumentToDomain(first.id, first.data());
  }

  async create(payload: ProjectUpsertPayload): Promise<Project> {
    const firestore = getFirebaseAdminFirestoreClient();
    const created = await firestore.collection(COLLECTION_NAME).add({
      ...payload,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const createdSnapshot = await created.get();

    if (createdSnapshot.exists) {
      return mapProjectDocumentToDomain(createdSnapshot.id, createdSnapshot.data());
    }

    return {
      id: created.id,
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async update(projectId: string, payload: ProjectUpsertPayload): Promise<Project | null> {
    const firestore = getFirebaseAdminFirestoreClient();
    const reference = firestore.collection(COLLECTION_NAME).doc(projectId);
    const snapshot = await reference.get();

    if (!snapshot.exists) {
      return null;
    }

    await reference.set(
      {
        ...payload,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    const updatedSnapshot = await reference.get();

    if (updatedSnapshot.exists) {
      return mapProjectDocumentToDomain(updatedSnapshot.id, updatedSnapshot.data());
    }

    return {
      id: projectId,
      ...payload,
      createdAt: normalizeDateValue(snapshot.data()?.createdAt),
      updatedAt: new Date().toISOString(),
    };
  }

  async delete(projectId: string): Promise<boolean> {
    const firestore = getFirebaseAdminFirestoreClient();
    const reference = firestore.collection(COLLECTION_NAME).doc(projectId);
    const snapshot = await reference.get();

    if (!snapshot.exists) {
      return false;
    }

    await reference.delete();

    return true;
  }
}
