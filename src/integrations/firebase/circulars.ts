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

export interface CircularItem {
  id: string;
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
  pdfUrl: string;
  createdAt?: number;
}

const COLLECTION = "circulars";

function normalizeCircularData(data: any): Omit<CircularItem, "id"> {
  return {
    title: String(data?.title ?? ""),
    category: String(data?.category ?? ""),
    date: String(data?.date ?? ""),
    pdfUrl: String(data?.pdfUrl ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

export async function fetchAllCirculars(): Promise<CircularItem[]> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeCircularData(d.data()),
  }));
}

export async function createCircular(
  data: Omit<CircularItem, "id" | "createdAt">
): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateCircular(
  id: string,
  data: Partial<Omit<CircularItem, "id" | "createdAt">>
): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteCircular(id: string): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await deleteDoc(itemRef);
}
