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

export type OfficerDepartment =
  | "agriculture"
  | "land"
  | "animal"
  | "fisheries"
  | "irrigation";

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
  department: OfficerDepartment;
  section: string;
  phone: string;
  email: string;
  location: string;
  image: string;
  createdAt?: number;
}

const COLLECTION = "officers";

const DEPT_SET = new Set<OfficerDepartment>([
  "agriculture",
  "land",
  "animal",
  "fisheries",
  "irrigation",
]);

function normalizeDepartment(v: unknown): OfficerDepartment {
  return DEPT_SET.has(v as OfficerDepartment)
    ? (v as OfficerDepartment)
    : "agriculture";
}

function normalizeOfficerData(data: Record<string, unknown>): Omit<OfficerItem, "id"> {
  return {
    name: String(data?.name ?? ""),
    role: String(data?.role ?? ""),
    department: normalizeDepartment(data?.department),
    section: String(data?.section ?? "Administrative"),
    phone: String(data?.phone ?? ""),
    email: String(data?.email ?? ""),
    location: String(data?.location ?? ""),
    image: String(data?.image ?? ""),
    createdAt: typeof data?.createdAt === "number" ? data.createdAt : undefined,
  };
}

export async function fetchAllOfficers(): Promise<OfficerItem[]> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...normalizeOfficerData(d.data() as Record<string, unknown>),
  }));
}

export async function createOfficer(
  data: Omit<OfficerItem, "id" | "createdAt">
): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateOfficer(
  id: string,
  data: Partial<Omit<OfficerItem, "id" | "createdAt">>
): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await updateDoc(itemRef, data);
}

export async function deleteOfficer(id: string): Promise<void> {
  const itemRef = doc(db, COLLECTION, id);
  await deleteDoc(itemRef);
}
