import {
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import type { DepartmentId } from "@/constants/departments";
import { deptCollection, deptDoc } from "./collectionPath";

export type NewsCategory = "announcement" | "event";

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  body: string;
  date: string;
  category: NewsCategory;
  isUrgent: boolean;
  image: string;
  createdAt?: number;
}

const COLLECTION = "news";

function normalizeNewsData(data: Record<string, unknown>): Omit<NewsItem, "id"> {
  return {
    title: String(data?.title ?? ""),
    description: String(data?.description ?? ""),
    body: String(data?.body ?? ""),
    date: String(data?.date ?? ""),
    category: (data?.category === "event" ? "event" : "announcement") as NewsCategory,
    isUrgent: Boolean(data?.isUrgent),
    image: String(data?.image ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

export async function fetchAllNews(deptId: DepartmentId): Promise<NewsItem[]> {
  const newsRef = deptCollection(deptId, COLLECTION);
  const q = query(newsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeNewsData(d.data() as Record<string, unknown>),
  }));
}

export async function fetchNewsById(deptId: DepartmentId, id: string): Promise<NewsItem | null> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  const snap = await getDoc(itemRef);
  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...normalizeNewsData(snap.data() as Record<string, unknown>),
  };
}

export async function createNews(
  deptId: DepartmentId,
  data: Omit<NewsItem, "id" | "createdAt">
) {
  const newsRef = deptCollection(deptId, COLLECTION);
  const docRef = await addDoc(newsRef, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateNews(
  deptId: DepartmentId,
  id: string,
  data: Partial<Omit<NewsItem, "id" | "createdAt">>
) {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteNews(deptId: DepartmentId, id: string) {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await deleteDoc(itemRef);
}
