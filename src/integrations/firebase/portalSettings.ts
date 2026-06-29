import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './client';
import { v4 as uuidv4 } from 'uuid';

export interface HeroImage {
  id: string;
  url: string;
  alt: string;
}

export interface VisitorCountSettings {
  enabled: boolean;
  count: number;
}

export interface MinistrySettings {
  description: string;
  startDate: string; // ISO date string for years of service calc
  vision: string;
  mission: string;
  imageUrl: string; // Hero section image for ministry
  leadershipMessages: { id: string; name: string; title: string; message: string; photoUrl: string }[];
  keyOfficers: { id: string; name: string; position: string; contact: string; photoUrl: string }[];
  headquarters: { address: string; phone: string; email: string; fax: string };
}

export interface ProvinceSettings {
  details: string;
  imageUrl: string; // Hero section image for province
  importantPlaces: { id: string; name: string; description: string; imageUrl: string }[];
}

export interface GlobalDepartmentSettings {
  picture: string;
  description: string;
}

export interface PortalSettings {
  heroImages: HeroImage[];
  visitorCount: VisitorCountSettings;
  ministry: MinistrySettings;
  province: ProvinceSettings;
  departmentsTab: GlobalDepartmentSettings;
  departmentHotlines: Record<string, string>; // departmentId -> hotline
  departmentHeroImages: Record<string, string>; // departmentId -> imageUrl
  departmentDetails: Record<string, { picture: string; description: string }>;
}

export const defaultSettings: PortalSettings = {
  heroImages: [],
  visitorCount: { enabled: true, count: 0 },
  ministry: {
    description: '',
    startDate: new Date().toISOString(),
    vision: '',
    mission: '',
    imageUrl: '',
    leadershipMessages: [],
    keyOfficers: [],
    headquarters: { address: '', phone: '', email: '', fax: '' },
  },
  province: {
    details: '',
    imageUrl: '',
    importantPlaces: [],
  },
  departmentsTab: {
    picture: '',
    description: '',
  },
  departmentHotlines: {},
  departmentHeroImages: {},
  departmentDetails: {},
};

export const SETTINGS_DOC_ID = 'main';
export const SETTINGS_COLLECTION = 'portalSettings';

export async function getPortalSettings(): Promise<PortalSettings> {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { ...defaultSettings, ...docSnap.data() } as PortalSettings;
  } else {
    // If it doesn't exist, create it with defaults
    await setDoc(docRef, defaultSettings);
    return defaultSettings;
  }
}

export async function updatePortalSettings(settings: Partial<PortalSettings>): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
  } catch (error: any) {
    // Re-throw with additional context
    const message = error?.message || 'Unknown error';
    const code = error?.code || 'unknown';
    throw new Error(`Failed to update portal settings (${code}): ${message}`);
  }
}

export const validateImage = (file: File, options?: { maxWidth?: number; maxHeight?: number; maxSizeMB?: number }): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (options?.maxSizeMB) {
      const maxSize = options.maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error(`File size must be less than ${options.maxSizeMB}MB`));
        return;
      }
    }

    if (!options?.maxWidth && !options?.maxHeight) {
      resolve();
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (options.maxWidth && img.width > options.maxWidth) {
        reject(new Error(`Image width must be less than or equal to ${options.maxWidth}px`));
        return;
      }
      if (options.maxHeight && img.height > options.maxHeight) {
        reject(new Error(`Image height must be less than or equal to ${options.maxHeight}px`));
        return;
      }
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Invalid image file'));
    };
    img.src = objectUrl;
  });
};

export async function uploadSettingImage(file: File, pathPrefix: string = 'portal-settings'): Promise<string> {
  const extension = file.name.split('.').pop();
  const fileName = `${pathPrefix}/${uuidv4()}.${extension}`;
  const fileRef = ref(storage, fileName);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}
