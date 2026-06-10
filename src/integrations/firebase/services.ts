import {
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import type { DepartmentId } from "@/constants/departments";
import { deptCollection, deptDoc } from "./collectionPath";

export type ServiceCategory = "citizen" | "employee" | "business" | "government";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  hasForm: boolean;
  createdAt?: number;
}

const COLLECTION = "services";

export async function fetchServicesByCategory(
  deptId: DepartmentId,
  category: ServiceCategory
): Promise<Service[]> {
  const servicesRef = deptCollection(deptId, COLLECTION);
  const q = query(servicesRef, where("category", "==", category), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Service, "id">),
  }));
}

export async function fetchAllServices(deptId: DepartmentId): Promise<Service[]> {
  const servicesRef = deptCollection(deptId, COLLECTION);
  const q = query(servicesRef, orderBy("category", "asc"), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Service, "id">),
  }));
}

export async function createService(
  deptId: DepartmentId,
  data: Omit<Service, "id" | "createdAt">
): Promise<string> {
  const servicesRef = deptCollection(deptId, COLLECTION);
  const docRef = await addDoc(servicesRef, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateService(
  deptId: DepartmentId,
  id: string,
  data: Partial<Omit<Service, "id">>
): Promise<void> {
  const serviceRef = deptDoc(deptId, COLLECTION, id);
  await updateDoc(serviceRef, data);
}

export async function deleteService(deptId: DepartmentId, id: string): Promise<void> {
  const serviceRef = deptDoc(deptId, COLLECTION, id);
  await deleteDoc(serviceRef);
}
