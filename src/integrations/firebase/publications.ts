import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./client";

export type PublicationKind = "report" | "journal" | "other";

export interface PublicationItem {
  id: string;
  title: string;
  description: string;
  type: PublicationKind;
  date: string; // YYYY-MM-DD
  image: string;
  pages: number;
  /** Optional URL opened in a new tab for "View online" */
  viewUrl: string;
  /** Optional URL for PDF / file download */
  downloadUrl: string;
  createdAt?: number;
}

const PUBLICATIONS_COLLECTION = "publications";

function normalizeKind(v: unknown): PublicationKind {
  if (v === "journal" || v === "other" || v === "report") return v;
  return "report";
}

function normalizePublicationData(data: any): Omit<PublicationItem, "id"> {
  const pages = Number(data?.pages);
  return {
    title: String(data?.title ?? ""),
    description: String(data?.description ?? ""),
    type: normalizeKind(data?.type),
    date: String(data?.date ?? ""),
    image: String(data?.image ?? ""),
    pages: Number.isFinite(pages) && pages >= 0 ? Math.floor(pages) : 0,
    viewUrl: String(data?.viewUrl ?? ""),
    downloadUrl: String(data?.downloadUrl ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

export async function fetchAllPublications(): Promise<PublicationItem[]> {
  const ref = collection(db, PUBLICATIONS_COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizePublicationData(d.data()),
  }));
}

export async function createPublication(
  data: Omit<PublicationItem, "id" | "createdAt">
) {
  const ref = collection(db, PUBLICATIONS_COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updatePublication(
  id: string,
  data: Partial<Omit<PublicationItem, "id" | "createdAt">>
) {
  const itemRef = doc(db, PUBLICATIONS_COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deletePublication(id: string) {
  const itemRef = doc(db, PUBLICATIONS_COLLECTION, id);
  await deleteDoc(itemRef);
}
