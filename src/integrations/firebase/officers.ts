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

export const OFFICER_SECTIONS = [
  "Administrative",
  "Accounts",
  "Development",
  "Planning",
  "Extension",
] as const;

export type OfficerSection = (typeof OFFICER_SECTIONS)[number];

export interface OfficerItem {
  id: string;
  name: string;
  role: string;
  section: string;
  phone: string;
  email: string;
  location: string;
  image: string;
  createdAt?: number;
}

const COLLECTION = "officers";

function normalizeOfficerData(data: Record<string, unknown>): Omit<OfficerItem, "id"> {
  return {
    name: String(data?.name ?? ""),
    role: String(data?.role ?? ""),
    section: String(data?.section ?? "Administrative"),
    phone: String(data?.phone ?? ""),
    email: String(data?.email ?? ""),
    location: String(data?.location ?? ""),
    image: String(data?.image ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

export async function fetchAllOfficers(deptId: DepartmentId): Promise<OfficerItem[]> {
  const ref = deptCollection(deptId, COLLECTION);
  const q = query(ref, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeOfficerData(d.data() as Record<string, unknown>),
  }));
}

export async function createOfficer(
  deptId: DepartmentId,
  data: Omit<OfficerItem, "id" | "createdAt">
): Promise<string> {
  const ref = deptCollection(deptId, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateOfficer(
  deptId: DepartmentId,
  id: string,
  data: Partial<Omit<OfficerItem, "id" | "createdAt">>
): Promise<void> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteOfficer(deptId: DepartmentId, id: string): Promise<void> {
  const itemRef = deptDoc(deptId, COLLECTION, id);
  await deleteDoc(itemRef);
}

/** @deprecated Use DepartmentId from constants/departments */
export type OfficerDepartment = DepartmentId;
