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

export type ExamListingType = "Exam" | "Course";

export interface ExamItem {
  id: string;
  title: string;
  type: ExamListingType;
  dates: string;
  eligibility: string;
  instructions: string;
  /** Firebase Storage or direct URL; empty hides “Download application” */
  applicationPdfUrl: string;
  /** Registration page; empty hides “Register online” */
  registerUrl: string;
  createdAt?: number;
}

const COLLECTION = "exams";

const TYPE_SET = new Set<ExamListingType>(["Exam", "Course"]);

function normalizeType(v: unknown): ExamListingType {
  return TYPE_SET.has(v as ExamListingType) ? (v as ExamListingType) : "Exam";
}

function normalizeExamData(data: Record<string, unknown>): Omit<ExamItem, "id"> {
  return {
    title: String(data?.title ?? ""),
    type: normalizeType(data?.type),
    dates: String(data?.dates ?? ""),
    eligibility: String(data?.eligibility ?? ""),
    instructions: String(data?.instructions ?? ""),
    applicationPdfUrl: String(data?.applicationPdfUrl ?? ""),
    registerUrl: String(data?.registerUrl ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

export async function fetchAllExams(): Promise<ExamItem[]> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeExamData(d.data() as Record<string, unknown>),
  }));
}

export async function createExam(
  data: Omit<ExamItem, "id" | "createdAt">
): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateExam(
  id: string,
  data: Partial<Omit<ExamItem, "id" | "createdAt">>
): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteExam(id: string): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await deleteDoc(itemRef);
}
