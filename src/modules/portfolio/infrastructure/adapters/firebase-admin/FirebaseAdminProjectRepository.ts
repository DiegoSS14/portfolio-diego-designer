import type { Project } from "../../../domain/entities/Project";
import type {
  ProjectRepository,
  ProjectUpsertPayload,
} from "../../../domain/repositories/ProjectRepository";
import { getFirebaseAdminFirestoreClient } from "@/modules/shared/infrastructure/adapters/firebase-admin/firebaseAdminClient";

const COLLECTION_NAME = "projects";

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
  };
}

export class FirebaseAdminProjectRepository implements ProjectRepository {
  async findAll(): Promise<Project[]> {
    const firestore = getFirebaseAdminFirestoreClient();
    const snapshot = await firestore.collection(COLLECTION_NAME).orderBy("title", "asc").get();

    return snapshot.docs.map((document) => mapProjectDocumentToDomain(document.id, document.data()));
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
    const created = await firestore.collection(COLLECTION_NAME).add(payload);

    return {
      id: created.id,
      ...payload,
    };
  }

  async update(projectId: string, payload: ProjectUpsertPayload): Promise<Project | null> {
    const firestore = getFirebaseAdminFirestoreClient();
    const reference = firestore.collection(COLLECTION_NAME).doc(projectId);
    const snapshot = await reference.get();

    if (!snapshot.exists) {
      return null;
    }

    await reference.set(payload, { merge: true });

    return {
      id: projectId,
      ...payload,
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
