import { collection, doc } from 'firebase/firestore';
import type { DepartmentId } from '@/constants/departments';
import { db } from './client';

export function deptCollection(deptId: DepartmentId, collectionName: string) {
  return collection(db, 'departments', deptId, collectionName);
}

export function deptDoc(deptId: DepartmentId, collectionName: string, docId: string) {
  return doc(db, 'departments', deptId, collectionName, docId);
}

export function deptStatisticsDoc(deptId: DepartmentId, docId = 'main') {
  return doc(db, 'departments', deptId, 'statistics', docId);
}
