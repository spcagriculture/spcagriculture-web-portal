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

export interface VacancyItem {
  id: string;
  title: string;
  deadline: string;
  description: string;
  pdfUrl: string;
  createdAt?: number;
}

const COLLECTION = "vacancies";

function normalizeVacancyData(data: unknown): Omit<VacancyItem, "id"> {
  const d = data as Record<string, unknown>;
  return {
    title: String(d?.title ?? ""),
    deadline: String(d?.deadline ?? ""),
    description: String(d?.description ?? ""),
    pdfUrl: String(d?.pdfUrl ?? ""),
    createdAt: typeof d?.createdAt === "number" ? d.createdAt : undefined,
  };
}

export async function fetchAllVacancies(deptId: DepartmentId): Promise<VacancyItem[]> {
  const ref = deptCollection(deptId, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeVacancyData(d.data()),
  }));
}

export async function createVacancy(
  deptId: DepartmentId,
  data: Omit<VacancyItem, "id" | "createdAt">
): Promise<string> {
  const ref = deptCollection(deptId, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateVacancy(
  deptId: DepartmentId,
  id: string,
  data: Partial<Omit<VacancyItem, "id" | "createdAt">>
): Promise<void> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteVacancy(deptId: DepartmentId, id: string): Promise<void> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await deleteDoc(itemRef);
}
