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

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  date: string;
  pdfUrl: string;
  createdAt?: number;
}

const COLLECTION = "documents";

function normalizeDocumentData(data: unknown): Omit<DocumentItem, "id"> {
  const d = data as Record<string, unknown>;
  return {
    title: String(d?.title ?? ""),
    category: String(d?.category ?? ""),
    date: String(d?.date ?? ""),
    pdfUrl: String(d?.pdfUrl ?? ""),
    createdAt: typeof d?.createdAt === "number" ? d.createdAt : undefined,
  };
}

export async function fetchAllDocuments(deptId: DepartmentId): Promise<DocumentItem[]> {
  const ref = deptCollection(deptId, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeDocumentData(d.data()),
  }));
}

export async function createDocument(
  deptId: DepartmentId,
  data: Omit<DocumentItem, "id" | "createdAt">
): Promise<string> {
  const ref = deptCollection(deptId, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateDocument(
  deptId: DepartmentId,
  id: string,
  data: Partial<Omit<DocumentItem, "id" | "createdAt">>
): Promise<void> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteDocument(deptId: DepartmentId, id: string): Promise<void> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await deleteDoc(itemRef);
}
