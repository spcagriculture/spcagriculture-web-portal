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

export type ProjectStatus = "planned" | "ongoing" | "completed";

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  image: string;
  createdAt?: number;
}

const COLLECTION = "projects";

const STATUS_SET = new Set<ProjectStatus>(["planned", "ongoing", "completed"]);

function normalizeStatus(v: unknown): ProjectStatus {
  return STATUS_SET.has(v as ProjectStatus) ? (v as ProjectStatus) : "planned";
}

function normalizeProjectData(data: Record<string, unknown>): Omit<ProjectItem, "id"> {
  return {
    title: String(data?.title ?? ""),
    description: String(data?.description ?? ""),
    fullDescription: String(data?.fullDescription ?? ""),
    status: normalizeStatus(data?.status),
    startDate: String(data?.startDate ?? ""),
    endDate: String(data?.endDate ?? ""),
    image: String(data?.image ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

export async function fetchAllProjects(deptId: DepartmentId): Promise<ProjectItem[]> {
  const ref = deptCollection(deptId, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeProjectData(d.data() as Record<string, unknown>),
  }));
}

export async function fetchProjectById(
  deptId: DepartmentId,
  id: string
): Promise<ProjectItem | null> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  const snap = await getDoc(itemRef);
  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...normalizeProjectData(snap.data() as Record<string, unknown>),
  };
}

export async function createProject(
  deptId: DepartmentId,
  data: Omit<ProjectItem, "id" | "createdAt">
): Promise<string> {
  const ref = deptCollection(deptId, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateProject(
  deptId: DepartmentId,
  id: string,
  data: Partial<Omit<ProjectItem, "id" | "createdAt">>
): Promise<void> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteProject(deptId: DepartmentId, id: string): Promise<void> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await deleteDoc(itemRef);
}

/** @deprecated Use DepartmentId from constants/departments */
export type ProjectDepartment = DepartmentId;
