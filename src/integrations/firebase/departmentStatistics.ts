import { getDoc, setDoc } from "firebase/firestore";
import {
  DEPARTMENT_IDS,
  type DepartmentId,
  isDepartmentId,
} from "@/constants/departments";
import { deptCollection, deptStatisticsDoc } from "./collectionPath";

export const STAT_DEPARTMENT_IDS = DEPARTMENT_IDS;
export type StatDepartmentId = DepartmentId;

export interface DepartmentStatistics {
  id: StatDepartmentId;
  columns: string[];
  rows: string[][];
  metadata: {
    source: string;
    lastUpdated: string;
    methodology: string;
  };
  updatedAt?: number;
}

function rowsFromFirestore(raw: unknown): string[][] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  const first = raw[0];
  if (
    typeof first === "object" &&
    first !== null &&
    "cells" in first &&
    Array.isArray((first as { cells: unknown }).cells)
  ) {
    return (raw as { cells: unknown[] }[]).map((r) =>
      Array.isArray(r.cells) ? r.cells.map((c) => String(c)) : []
    );
  }
  return [];
}

function normalize(
  data: Record<string, unknown> | undefined,
  id: StatDepartmentId
): DepartmentStatistics {
  const cols = Array.isArray(data?.columns)
    ? (data!.columns as unknown[]).map((c) => String(c))
    : [];
  const rows: string[][] = rowsFromFirestore(data?.rows);
  const meta = data?.metadata as Record<string, unknown> | undefined;
  return {
    id,
    columns: cols,
    rows,
    metadata: {
      source: String(meta?.source ?? ""),
      lastUpdated: String(meta?.lastUpdated ?? ""),
      methodology: String(meta?.methodology ?? ""),
    },
    updatedAt: typeof data?.updatedAt === "number" ? data.updatedAt : undefined,
  };
}

export async function fetchDepartmentStatistics(
  id: StatDepartmentId
): Promise<DepartmentStatistics | null> {
  const ref = deptStatisticsDoc(id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return normalize(snap.data() as Record<string, unknown>, id);
}

export async function fetchAllDepartmentStatistics(): Promise<DepartmentStatistics[]> {
  const out: DepartmentStatistics[] = [];
  for (const deptId of DEPARTMENT_IDS) {
    const stats = await fetchDepartmentStatistics(deptId);
    if (stats) out.push(stats);
  }
  return out;
}

export async function saveDepartmentStatistics(
  data: Omit<DepartmentStatistics, "updatedAt">
): Promise<void> {
  const ref = deptStatisticsDoc(data.id);
  const rowDocuments = data.rows.map((cells) => ({ cells }));
  await setDoc(
    ref,
    {
      columns: data.columns,
      rows: rowDocuments,
      metadata: data.metadata,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export { isDepartmentId as isStatDepartmentId };
