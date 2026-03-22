import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./client";

export type ProjectDepartment =
  | "agriculture"
  | "land"
  | "animal"
  | "fisheries"
  | "irrigation";

export type ProjectStatus = "planned" | "ongoing" | "completed";

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  department: ProjectDepartment;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  image: string;
  createdAt?: number;
}

const COLLECTION = "projects";

const DEPT_SET = new Set<ProjectDepartment>([
  "agriculture",
  "land",
  "animal",
  "fisheries",
  "irrigation",
]);

const STATUS_SET = new Set<ProjectStatus>(["planned", "ongoing", "completed"]);

function normalizeDepartment(v: unknown): ProjectDepartment {
  return DEPT_SET.has(v as ProjectDepartment)
    ? (v as ProjectDepartment)
    : "agriculture";
}

function normalizeStatus(v: unknown): ProjectStatus {
  return STATUS_SET.has(v as ProjectStatus) ? (v as ProjectStatus) : "planned";
}

function normalizeProjectData(data: any): Omit<ProjectItem, "id"> {
  return {
    title: String(data?.title ?? ""),
    description: String(data?.description ?? ""),
    fullDescription: String(data?.fullDescription ?? ""),
    department: normalizeDepartment(data?.department),
    status: normalizeStatus(data?.status),
    startDate: String(data?.startDate ?? ""),
    endDate: String(data?.endDate ?? ""),
    image: String(data?.image ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

export async function fetchAllProjects(): Promise<ProjectItem[]> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeProjectData(d.data()),
  }));
}

export async function fetchProjectById(id: string): Promise<ProjectItem | null> {
  const itemRef = doc(db, COLLECTION, id);
  const snap = await getDoc(itemRef);
  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...normalizeProjectData(snap.data()),
  };
}

export async function createProject(
  data: Omit<ProjectItem, "id" | "createdAt">
): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateProject(
  id: string,
  data: Partial<Omit<ProjectItem, "id" | "createdAt">>
): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteProject(id: string): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await deleteDoc(itemRef);
}
