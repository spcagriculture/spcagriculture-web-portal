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

export interface GalleryEventItem {
  id: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** Image URLs (Firebase Storage or external) */
  images: string[];
  createdAt?: number;
}

const GALLERY_COLLECTION = "galleryEvents";

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

export async function fetchAllGalleryEvents(): Promise<GalleryEventItem[]> {
  const ref = collection(db, GALLERY_COLLECTION);
  const q = query(ref, orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeGalleryEvent(d.data()),
  }));
}

export async function createGalleryEvent(
  data: Omit<GalleryEventItem, "id" | "createdAt">
) {
  const ref = collection(db, GALLERY_COLLECTION);
  const docRef = await addDoc(ref, {
    title: data.title,
    date: data.date,
    images: data.images,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateGalleryEvent(
  id: string,
  data: Partial<Omit<GalleryEventItem, "id" | "createdAt">>
) {
  const itemRef = doc(db, GALLERY_COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteGalleryEvent(id: string) {
  const itemRef = doc(db, GALLERY_COLLECTION, id);
  await deleteDoc(itemRef);
}
