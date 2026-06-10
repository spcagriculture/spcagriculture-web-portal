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

export interface CircularItem {
  id: string;
  title: string;
  category: string;
  date: string;
  pdfUrl: string;
  createdAt?: number;
}

const COLLECTION = "circulars";

function normalizeCircularData(data: Record<string, unknown>): Omit<CircularItem, "id"> {
  return {
    title: String(data?.title ?? ""),
    category: String(data?.category ?? ""),
    date: String(data?.date ?? ""),
    pdfUrl: String(data?.pdfUrl ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

export async function fetchAllCirculars(deptId: DepartmentId): Promise<CircularItem[]> {
  const ref = deptCollection(deptId, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeCircularData(d.data() as Record<string, unknown>),
  }));
}

export async function createCircular(
  deptId: DepartmentId,
  data: Omit<CircularItem, "id" | "createdAt">
): Promise<string> {
  const ref = deptCollection(deptId, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateCircular(
  deptId: DepartmentId,
  id: string,
  data: Partial<Omit<CircularItem, "id" | "createdAt">>
): Promise<void> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteCircular(deptId: DepartmentId, id: string): Promise<void> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await deleteDoc(itemRef);
}
