import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import type { Project } from "../../../domain/entities/Project";
import type { ProjectRepository } from "../../../domain/repositories/ProjectRepository";
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
}
