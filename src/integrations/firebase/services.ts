import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./client";

export type ServiceCategory = "citizen" | "employee" | "business" | "government";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  hasForm: boolean;
  createdAt?: number;
}

const SERVICES_COLLECTION = "services";

export async function fetchServicesByCategory(category: ServiceCategory): Promise<Service[]> {
  const servicesRef = collection(db, SERVICES_COLLECTION);
  const q = query(
    servicesRef,
    where("category", "==", category),
    orderBy("name", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Service, "id">),
  }));
}

export async function fetchAllServices(): Promise<Service[]> {
  const servicesRef = collection(db, SERVICES_COLLECTION);
  const q = query(servicesRef, orderBy("category", "asc"), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Service, "id">),
  }));
}

export async function createService(
  data: Omit<Service, "id" | "createdAt">
): Promise<string> {
  const servicesRef = collection(db, SERVICES_COLLECTION);
  const docRef = await addDoc(servicesRef, {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateService(
  id: string,
  data: Partial<Omit<Service, "id">>
): Promise<void> {
  const serviceRef = doc(db, SERVICES_COLLECTION, id);
  await updateDoc(serviceRef, data);
}

export async function deleteService(id: string): Promise<void> {
  const serviceRef = doc(db, SERVICES_COLLECTION, id);
  await deleteDoc(serviceRef);
}

