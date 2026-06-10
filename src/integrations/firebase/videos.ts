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

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  date: string;
  youtubeUrl: string;
  createdAt?: number;
}

const COLLECTION = "videos";

function normalizeVideoData(data: Record<string, unknown>): Omit<VideoItem, "id"> {
  return {
    title: String(data?.title ?? ""),
    description: String(data?.description ?? ""),
    date: String(data?.date ?? ""),
    youtubeUrl: String(data?.youtubeUrl ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

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

export async function fetchAllVideos(deptId: DepartmentId): Promise<VideoItem[]> {
  const ref = deptCollection(deptId, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeVideoData(d.data() as Record<string, unknown>),
  }));
}

export async function createVideo(
  deptId: DepartmentId,
  data: Omit<VideoItem, "id" | "createdAt">
) {
  const ref = deptCollection(deptId, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateVideo(
  deptId: DepartmentId,
  id: string,
  data: Partial<Omit<VideoItem, "id" | "createdAt">>
) {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteVideo(deptId: DepartmentId, id: string) {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await deleteDoc(itemRef);
}

/** @deprecated Use DepartmentId from constants/departments */
export type VideoDepartment = DepartmentId;
