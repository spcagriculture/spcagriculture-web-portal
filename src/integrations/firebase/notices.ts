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

export type NoticeUrgency = "high" | "normal";

export interface NoticeItem {
  id: string;
  title: string;
  summary: string;
  body: string;
  date: string;
  urgency: NoticeUrgency;
  image: string;
  createdAt?: number;
}

const COLLECTION = "notices";

function normalizeNoticeData(data: Record<string, unknown>): Omit<NoticeItem, "id"> {
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

export async function fetchAllNotices(deptId: DepartmentId): Promise<NoticeItem[]> {
  const ref = deptCollection(deptId, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeNoticeData(d.data() as Record<string, unknown>),
  }));
}

export async function fetchNoticeById(
  deptId: DepartmentId,
  id: string
): Promise<NoticeItem | null> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  const snap = await getDoc(itemRef);
  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...normalizeNoticeData(snap.data() as Record<string, unknown>),
  };
}

export async function createNotice(
  deptId: DepartmentId,
  data: Omit<NoticeItem, "id" | "createdAt">
) {
  const ref = deptCollection(deptId, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateNotice(
  deptId: DepartmentId,
  id: string,
  data: Partial<Omit<NoticeItem, "id" | "createdAt">>
) {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteNotice(deptId: DepartmentId, id: string) {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await deleteDoc(itemRef);
}
