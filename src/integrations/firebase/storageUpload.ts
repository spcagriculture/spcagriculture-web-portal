import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./client";

export type StorageUploadFolder =
  | "news/images"
  | "notices/images"
  | "publications/covers"
  | "publications/files"
  | "projects/images"
  | "gallery/images"
  | "officers/images"
  | "circulars/pdfs"
  | "documents/pdfs"
  | "exams/pdfs"
  | "vacancies/pdfs"
  | "results/pdfs";

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
  const downloadName = safeFileName(file.name);
  const isLibraryPdf =
    folder === "circulars/pdfs" ||
    folder === "documents/pdfs" ||
    folder === "exams/pdfs" ||
    folder === "vacancies/pdfs" ||
    folder === "results/pdfs";
  const metadata = isLibraryPdf
    ? {
        contentType: file.type || "application/pdf",
        contentDisposition: `attachment; filename="${downloadName}"`,
      }
    : { contentType: file.type || undefined };
  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
}
