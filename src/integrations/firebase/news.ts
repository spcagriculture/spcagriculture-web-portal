import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./client";

export type NewsCategory = "announcement" | "event";

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  body: string;
  date: string; // YYYY-MM-DD
  category: NewsCategory;
  isUrgent: boolean;
  image: string; // URL
  createdAt?: number;
}

const NEWS_COLLECTION = "news";

function normalizeNewsData(data: any): Omit<NewsItem, "id"> {
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

export async function fetchAllNews(): Promise<NewsItem[]> {
  const newsRef = collection(db, NEWS_COLLECTION);
  const q = query(newsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeNewsData(d.data()),
  }));
}

export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  const itemRef = doc(db, NEWS_COLLECTION, id);
  const snap = await getDoc(itemRef);

  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...normalizeNewsData(snap.data()),
  };
}

export async function createNews(data: Omit<NewsItem, "id" | "createdAt">) {
  const newsRef = collection(db, NEWS_COLLECTION);
  const docRef = await addDoc(newsRef, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateNews(
  id: string,
  data: Partial<Omit<NewsItem, "id" | "createdAt">>
) {
  const itemRef = doc(db, NEWS_COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteNews(id: string) {
  const itemRef = doc(db, NEWS_COLLECTION, id);
  await deleteDoc(itemRef);
}

