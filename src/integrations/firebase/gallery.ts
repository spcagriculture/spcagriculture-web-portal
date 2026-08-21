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

import { DEPARTMENT_IDS } from "@/constants/departments";

export interface GalleryEventItem {
  id: string;
  title: string;
  date: string;
  images: string[];
  createdAt?: number;
  departmentId?: string;
}

const COLLECTION = "galleryEvents";

function normalizeImages(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeGalleryEvent(data: unknown): Omit<GalleryEventItem, "id"> {
  const d = data as Record<string, unknown>;
  return {
    title: String(d?.title ?? ""),
    date: String(d?.date ?? ""),
    images: normalizeImages(d?.images),
    createdAt: typeof d?.createdAt === "number" ? d.createdAt : undefined,
  };
}

export async function fetchAllGalleryEvents(deptId: DepartmentId): Promise<GalleryEventItem[]> {
  const ref = deptCollection(deptId, COLLECTION);
  const q = query(ref, orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeGalleryEvent(d.data()),
  }));
}

export async function fetchGlobalGalleryEvents(): Promise<GalleryEventItem[]> {
  const allEvents: GalleryEventItem[] = [];
  for (const deptId of DEPARTMENT_IDS) {
    try {
      const events = await fetchAllGalleryEvents(deptId);
      allEvents.push(...events.map(e => ({ ...e, departmentId: deptId })));
    } catch (error) {
      console.error(`Failed to fetch gallery events for department ${deptId}:`, error);
    }
  }
  return allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createGalleryEvent(
  deptId: DepartmentId,
  data: Omit<GalleryEventItem, "id" | "createdAt">
) {
  const ref = deptCollection(deptId, COLLECTION);
  const docRef = await addDoc(ref, {
    title: data.title,
    date: data.date,
    images: data.images,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateGalleryEvent(
  deptId: DepartmentId,
  id: string,
  data: Partial<Omit<GalleryEventItem, "id" | "createdAt">>
) {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteGalleryEvent(deptId: DepartmentId, id: string) {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await deleteDoc(itemRef);
}
