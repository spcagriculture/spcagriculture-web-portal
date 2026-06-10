import {
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import type { DepartmentId } from "@/constants/departments";
import { deptCollection, deptDoc } from "./collectionPath";

export type PublicationKind = "report" | "journal" | "other";

export interface PublicationItem {
  id: string;
  title: string;
  description: string;
  type: PublicationKind;
  date: string;
  image: string;
  pages: number;
  viewUrl: string;
  downloadUrl: string;
  createdAt?: number;
}

const COLLECTION = "publications";

function normalizeKind(v: unknown): PublicationKind {
  if (v === "journal" || v === "other" || v === "report") return v;
  return "report";
}

function normalizePublicationData(data: Record<string, unknown>): Omit<PublicationItem, "id"> {
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

export async function fetchAllPublications(deptId: DepartmentId): Promise<PublicationItem[]> {
  const ref = deptCollection(deptId, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizePublicationData(d.data() as Record<string, unknown>),
  }));
}

export async function createPublication(
  deptId: DepartmentId,
  data: Omit<PublicationItem, "id" | "createdAt">
) {
  const ref = deptCollection(deptId, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updatePublication(
  deptId: DepartmentId,
  id: string,
  data: Partial<Omit<PublicationItem, "id" | "createdAt">>
) {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deletePublication(deptId: DepartmentId, id: string) {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await deleteDoc(itemRef);
}
