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

export type NoticeUrgency = "high" | "normal";

export interface NoticeItem {
  id: string;
  title: string;
  summary: string;
  body: string;
  date: string; // YYYY-MM-DD
  urgency: NoticeUrgency;
  image: string;
  createdAt?: number;
}

const NOTICES_COLLECTION = "notices";

function normalizeNoticeData(data: any): Omit<NoticeItem, "id"> {
  return {
    title: String(data?.title ?? ""),
    summary: String(data?.summary ?? ""),
    body: String(data?.body ?? ""),
    date: String(data?.date ?? ""),
    urgency: data?.urgency === "high" ? "high" : "normal",
    image: String(data?.image ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

export async function fetchAllNotices(): Promise<NoticeItem[]> {
  const ref = collection(db, NOTICES_COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeNoticeData(d.data()),
  }));
}

export async function fetchNoticeById(id: string): Promise<NoticeItem | null> {
  const itemRef = doc(db, NOTICES_COLLECTION, id);
  const snap = await getDoc(itemRef);

  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...normalizeNoticeData(snap.data()),
  };
}

export async function createNotice(data: Omit<NoticeItem, "id" | "createdAt">) {
  const ref = collection(db, NOTICES_COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateNotice(
  id: string,
  data: Partial<Omit<NoticeItem, "id" | "createdAt">>
) {
  const itemRef = doc(db, NOTICES_COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteNotice(id: string) {
  const itemRef = doc(db, NOTICES_COLLECTION, id);
  await deleteDoc(itemRef);
}
