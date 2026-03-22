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

export type VideoDepartment =
  | "agriculture"
  | "land"
  | "animal"
  | "fisheries"
  | "irrigation";

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  department: VideoDepartment;
  date: string; // YYYY-MM-DD
  /** Paste any standard YouTube watch / short / youtu.be URL (no file uploads). */
  youtubeUrl: string;
  createdAt?: number;
}

const VIDEOS_COLLECTION = "videos";

const DEPT_SET = new Set<VideoDepartment>([
  "agriculture",
  "land",
  "animal",
  "fisheries",
  "irrigation",
]);

function normalizeDepartment(v: unknown): VideoDepartment {
  return DEPT_SET.has(v as VideoDepartment)
    ? (v as VideoDepartment)
    : "agriculture";
}

function normalizeVideoData(data: any): Omit<VideoItem, "id"> {
  return {
    title: String(data?.title ?? ""),
    description: String(data?.description ?? ""),
    department: normalizeDepartment(data?.department),
    date: String(data?.date ?? ""),
    youtubeUrl: String(data?.youtubeUrl ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

/** Accepts watch, embed, shorts, youtu.be, or bare 11-char id. */
export function extractYoutubeVideoId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;

  let m = s.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  m = s.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  m = s.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  m = s.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

  return null;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export async function fetchAllVideos(): Promise<VideoItem[]> {
  const ref = collection(db, VIDEOS_COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeVideoData(d.data()),
  }));
}

export async function createVideo(data: Omit<VideoItem, "id" | "createdAt">) {
  const ref = collection(db, VIDEOS_COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateVideo(
  id: string,
  data: Partial<Omit<VideoItem, "id" | "createdAt">>
) {
  const itemRef = doc(db, VIDEOS_COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteVideo(id: string) {
  const itemRef = doc(db, VIDEOS_COLLECTION, id);
  await deleteDoc(itemRef);
}
