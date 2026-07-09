import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './client';
import { getPortalSettings, updatePortalSettings } from './portalSettings';
import type { DepartmentId } from '@/constants/departments';

export interface SystemStats {
  downloadsCount: number;
  uploadsCount: number;
  departmentUsage: Record<string, number>;
}

const STATS_DOC_ID = 'main';
const STATS_COLLECTION = 'systemStats';

export const defaultStats: SystemStats = {
  downloadsCount: 0,
  uploadsCount: 0,
  departmentUsage: {
    agriculture: 0,
    land: 0,
    animal: 0,
    fisheries: 0,
    irrigation: 0
  }
};

export async function getSystemStats(): Promise<SystemStats> {
  try {
    const docRef = doc(db, STATS_COLLECTION, STATS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        downloadsCount: typeof data.downloadsCount === 'number' ? data.downloadsCount : 0,
        uploadsCount: typeof data.uploadsCount === 'number' ? data.uploadsCount : 0,
        departmentUsage: {
          ...defaultStats.departmentUsage,
          ...(data.departmentUsage || {})
        }
      } as SystemStats;
    } else {
      await setDoc(docRef, defaultStats);
      return defaultStats;
    }
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return defaultStats;
  }
}

export async function incrementVisitorCount(): Promise<void> {
  try {
    // Visitor count is traditionally stored in the portalSettings 'main' doc
    // which has 'visitorCount: { enabled: boolean, count: number }'
    const settings = await getPortalSettings();
    const newCount = (settings.visitorCount?.count || 0) + 1;
    await updatePortalSettings({
      visitorCount: {
        enabled: settings.visitorCount?.enabled !== false,
        count: newCount
      }
    });
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
  }
}

export async function recordUpload(deptId?: DepartmentId): Promise<void> {
  try {
    const docRef = doc(db, STATS_COLLECTION, STATS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        downloadsCount: 0,
        uploadsCount: 1,
        departmentUsage: deptId
          ? { ...defaultStats.departmentUsage, [deptId]: 1 }
          : defaultStats.departmentUsage
      });
      return;
    }

    const updates: Record<string, any> = {
      uploadsCount: increment(1)
    };
    if (deptId) {
      updates[`departmentUsage.${deptId}`] = increment(1);
    }
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error recording upload:', error);
  }
}

export async function recordDownload(deptId?: DepartmentId): Promise<void> {
  try {
    const docRef = doc(db, STATS_COLLECTION, STATS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        downloadsCount: 1,
        uploadsCount: 0,
        departmentUsage: deptId
          ? { ...defaultStats.departmentUsage, [deptId]: 1 }
          : defaultStats.departmentUsage
      });
      return;
    }

    const updates: Record<string, any> = {
      downloadsCount: increment(1)
    };
    if (deptId) {
      updates[`departmentUsage.${deptId}`] = increment(1);
    }
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error recording download:', error);
  }
}
