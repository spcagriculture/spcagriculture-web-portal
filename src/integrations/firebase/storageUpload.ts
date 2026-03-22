import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./client";

export type StorageUploadFolder =
  | "news/images"
  | "notices/images"
  | "publications/covers"
  | "publications/files";

function safeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.slice(0, 120) || "file";
}

function randomSuffix(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().slice(0, 8);
  }
  return String(Math.random()).slice(2, 10);
}

/**
 * Uploads a file to Firebase Storage and returns a download URL to store in Firestore.
 */
export async function uploadToStorage(
  folder: StorageUploadFolder,
  file: File
): Promise<string> {
  const objectName = `${Date.now()}_${randomSuffix()}_${safeFileName(file.name)}`;
  const storageRef = ref(storage, `${folder}/${objectName}`);
  await uploadBytes(storageRef, file, {
    contentType: file.type || undefined,
  });
  return getDownloadURL(storageRef);
}
