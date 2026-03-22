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

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  department: string;
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
    department: String(d?.department ?? ""),
    date: String(d?.date ?? ""),
    pdfUrl: String(d?.pdfUrl ?? ""),
    createdAt: typeof d?.createdAt === "number" ? d.createdAt : undefined,
  };
}

export async function fetchAllDocuments(): Promise<DocumentItem[]> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeDocumentData(d.data()),
  }));
}

export async function createDocument(
  data: Omit<DocumentItem, "id" | "createdAt">
): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateDocument(
  id: string,
  data: Partial<Omit<DocumentItem, "id" | "createdAt">>
): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteDocument(id: string): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await deleteDoc(itemRef);
}
