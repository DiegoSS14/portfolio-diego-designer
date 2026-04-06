import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import type { Project } from "../../../domain/entities/Project";
import type {
  ProjectRepository,
  ProjectUpsertPayload,
} from "../../../domain/repositories/ProjectRepository";
import { getFirestoreDatabase } from "./firebaseClient";

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

function mapProjectDocumentToDomain(data: Record<string, unknown>): Project {
  return {
    id: String(data.id ?? ""),
    slug: String(data.slug ?? ""),
    title: String(data.title ?? ""),
    shortDescription: String(data.shortDescription ?? ""),
    fullDescription: String(data.fullDescription ?? ""),
    thumbnailUrl: String(data.thumbnailUrl ?? ""),
    mediaUrls: Array.isArray(data.mediaUrls)
      ? data.mediaUrls.map((mediaItem) => String(mediaItem))
      : [],
    tags: Array.isArray(data.tags)
      ? data.tags.map((tagItem) => String(tagItem))
      : [],
    createdAt: normalizeDateValue(data.createdAt),
    updatedAt: normalizeDateValue(data.updatedAt),
  };
}

export class FirebaseProjectRepository implements ProjectRepository {
  async findAll(): Promise<Project[]> {
    const firestoreDatabase = getFirestoreDatabase();
    const projectsCollection = collection(firestoreDatabase, COLLECTION_NAME);
    const projectSnapshots = await getDocs(projectsCollection);
    const projects = projectSnapshots.docs.map((projectDocument) =>
      mapProjectDocumentToDomain({
        id: projectDocument.id,
        ...projectDocument.data(),
      }),
    );

    return projects.sort(
      (left, right) => getProjectRecencyTimestamp(right) - getProjectRecencyTimestamp(left),
    );
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const firestoreDatabase = getFirestoreDatabase();
    const projectsCollection = collection(firestoreDatabase, COLLECTION_NAME);
    const filteredBySlugQuery = query(projectsCollection, where("slug", "==", slug));
    const projectSnapshots = await getDocs(filteredBySlugQuery);

    const firstProject = projectSnapshots.docs[0];

    if (!firstProject) {
      return null;
    }

    const detailSnapshot = await getDoc(doc(firestoreDatabase, COLLECTION_NAME, firstProject.id));

    if (!detailSnapshot.exists()) {
      return null;
    }

    return mapProjectDocumentToDomain({
      id: detailSnapshot.id,
      ...detailSnapshot.data(),
    });
  }

  async create(payload: ProjectUpsertPayload): Promise<Project> {
    const firestoreDatabase = getFirestoreDatabase();
    const projectsCollection = collection(firestoreDatabase, COLLECTION_NAME);
    const createdDocument = await addDoc(projectsCollection, {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const createdSnapshot = await getDoc(createdDocument);

    if (createdSnapshot.exists()) {
      return mapProjectDocumentToDomain({
        id: createdSnapshot.id,
        ...createdSnapshot.data(),
      });
    }

    return {
      id: createdDocument.id,
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async update(projectId: string, payload: ProjectUpsertPayload): Promise<Project | null> {
    const firestoreDatabase = getFirestoreDatabase();
    const projectReference = doc(firestoreDatabase, COLLECTION_NAME, projectId);
    const existingProjectSnapshot = await getDoc(projectReference);

    if (!existingProjectSnapshot.exists()) {
      return null;
    }

    await setDoc(
      projectReference,
      {
        ...payload,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    const updatedSnapshot = await getDoc(projectReference);

    if (updatedSnapshot.exists()) {
      return mapProjectDocumentToDomain({
        id: updatedSnapshot.id,
        ...updatedSnapshot.data(),
      });
    }

    return {
      id: projectId,
      ...payload,
      createdAt: normalizeDateValue(existingProjectSnapshot.data().createdAt),
      updatedAt: new Date().toISOString(),
    };
  }

  async delete(projectId: string): Promise<boolean> {
    const firestoreDatabase = getFirestoreDatabase();
    const projectReference = doc(firestoreDatabase, COLLECTION_NAME, projectId);
    const existingProjectSnapshot = await getDoc(projectReference);

    if (!existingProjectSnapshot.exists()) {
      return false;
    }

    await deleteDoc(projectReference);

    return true;
  }
}
