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

export interface ExamResultItem {
  id: string;
  examName: string;
  publishDate: string;
  pdfUrl: string;
  createdAt?: number;
}

const COLLECTION = "exam_results";

function normalizeData(data: unknown): Omit<ExamResultItem, "id"> {
  const d = data as Record<string, unknown>;
  return {
    examName: String(d?.examName ?? ""),
    publishDate: String(d?.publishDate ?? ""),
    pdfUrl: String(d?.pdfUrl ?? ""),
    createdAt: typeof d?.createdAt === "number" ? d.createdAt : undefined,
  };
}

export async function fetchAllExamResults(): Promise<ExamResultItem[]> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeData(d.data()),
  }));
}

export async function createExamResult(
  data: Omit<ExamResultItem, "id" | "createdAt">
): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateExamResult(
  id: string,
  data: Partial<Omit<ExamResultItem, "id" | "createdAt">>
): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteExamResult(id: string): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await deleteDoc(itemRef);
}
