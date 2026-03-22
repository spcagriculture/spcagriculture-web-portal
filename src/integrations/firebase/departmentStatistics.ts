import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./client";

export const STAT_DEPARTMENT_IDS = [
  "agriculture",
  "land",
  "animal",
  "fisheries",
  "irrigation",
] as const;

export type StatDepartmentId = (typeof STAT_DEPARTMENT_IDS)[number];

export interface DepartmentStatistics {
  id: StatDepartmentId;
  columns: string[];
  /** Each row is an array of cell values in the same order as `columns`. */
  rows: string[][];
  metadata: {
    source: string;
    lastUpdated: string;
    methodology: string;
  };
  updatedAt?: number;
}

const COLLECTION = "department_statistics";

/** Firestore does not allow arrays of arrays; we store each row as `{ cells: string[] }`. */
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

function isStatDepartmentId(id: string): id is StatDepartmentId {
  return (STAT_DEPARTMENT_IDS as readonly string[]).includes(id);
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
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return normalize(snap.data() as Record<string, unknown>, id);
}

export async function fetchAllDepartmentStatistics(): Promise<DepartmentStatistics[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  const out: DepartmentStatistics[] = [];
  for (const d of snap.docs) {
    if (!isStatDepartmentId(d.id)) continue;
    out.push(normalize(d.data() as Record<string, unknown>, d.id));
  }
  return out;
}

export async function saveDepartmentStatistics(
  data: Omit<DepartmentStatistics, "updatedAt">
): Promise<void> {
  const ref = doc(db, COLLECTION, data.id);
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
