import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
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
  };
}

export class FirebaseProjectRepository implements ProjectRepository {
  async findAll(): Promise<Project[]> {
    const firestoreDatabase = getFirestoreDatabase();
    const projectsCollection = collection(firestoreDatabase, COLLECTION_NAME);
    const orderedProjectsQuery = query(projectsCollection, orderBy("title", "asc"));
    const projectSnapshots = await getDocs(orderedProjectsQuery);

    return projectSnapshots.docs.map((projectDocument) =>
      mapProjectDocumentToDomain({
        id: projectDocument.id,
        ...projectDocument.data(),
      }),
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
    const createdDocument = await addDoc(projectsCollection, payload);

    return {
      id: createdDocument.id,
      ...payload,
    };
  }

  async update(projectId: string, payload: ProjectUpsertPayload): Promise<Project | null> {
    const firestoreDatabase = getFirestoreDatabase();
    const projectReference = doc(firestoreDatabase, COLLECTION_NAME, projectId);
    const existingProjectSnapshot = await getDoc(projectReference);

    if (!existingProjectSnapshot.exists()) {
      return null;
    }

    await setDoc(projectReference, payload, { merge: true });

    return {
      id: projectId,
      ...payload,
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
