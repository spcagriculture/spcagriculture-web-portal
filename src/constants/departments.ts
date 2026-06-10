import type { LucideIcon } from 'lucide-react';
import { Wheat, Map, PawPrint, Fish, Droplets } from 'lucide-react';

export const DEPARTMENT_IDS = [
  'agriculture',
  'land',
  'animal',
  'fisheries',
  'irrigation',
] as const;

export type DepartmentId = (typeof DEPARTMENT_IDS)[number];

export interface DepartmentConfig {
  id: DepartmentId;
  nameKey: DepartmentId;
  descriptionKey: string;
  taglineKey: string;
  icon: LucideIcon;
  theme: {
    primary: string;
    accent: string;
    heroImage: string;
    cardClass: string;
    iconClass: string;
  };
}

export const DEPARTMENTS: Record<DepartmentId, DepartmentConfig> = {
  agriculture: {
    id: 'agriculture',
    nameKey: 'agriculture',
    descriptionKey: 'agricultureDesc',
    taglineKey: 'agricultureTagline',
    icon: Wheat,
    theme: {
      primary: 'hsl(142 76% 28%)',
      accent: 'hsl(45 93% 47%)',
      heroImage: '/images/Sabaragamuwa.jpg',
      cardClass: 'border-emerald-200 hover:border-emerald-400',
      iconClass: 'bg-emerald-100 text-emerald-600',
    },
  },
  land: {
    id: 'land',
    nameKey: 'land',
    descriptionKey: 'landDesc',
    taglineKey: 'landTagline',
    icon: Map,
    theme: {
      primary: 'hsl(32 95% 35%)',
      accent: 'hsl(45 93% 47%)',
      heroImage: '/images/ratnapura.jpg',
      cardClass: 'border-amber-200 hover:border-amber-400',
      iconClass: 'bg-amber-100 text-amber-600',
    },
  },
  animal: {
    id: 'animal',
    nameKey: 'animal',
    descriptionKey: 'animalDesc',
    taglineKey: 'animalTagline',
    icon: PawPrint,
    theme: {
      primary: 'hsl(350 65% 40%)',
      accent: 'hsl(45 93% 47%)',
      heroImage: '/images/Pinnawala-Elephant-Orphanage.jpg',
      cardClass: 'border-rose-200 hover:border-rose-400',
      iconClass: 'bg-rose-100 text-rose-600',
    },
  },
  fisheries: {
    id: 'fisheries',
    nameKey: 'fisheries',
    descriptionKey: 'fisheriesDesc',
    taglineKey: 'fisheriesTagline',
    icon: Fish,
    theme: {
      primary: 'hsl(210 80% 40%)',
      accent: 'hsl(45 93% 47%)',
      heroImage: '/images/Udawalawe-National-Park.jpg',
      cardClass: 'border-blue-200 hover:border-blue-400',
      iconClass: 'bg-blue-100 text-blue-600',
    },
  },
  irrigation: {
    id: 'irrigation',
    nameKey: 'irrigation',
    descriptionKey: 'irrigationDesc',
    taglineKey: 'irrigationTagline',
    icon: Droplets,
    theme: {
      primary: 'hsl(190 80% 35%)',
      accent: 'hsl(45 93% 47%)',
      heroImage: '/images/Bopath-Ella-Falls.jpg',
      cardClass: 'border-cyan-200 hover:border-cyan-400',
      iconClass: 'bg-cyan-100 text-cyan-600',
    },
  },
};

export function isDepartmentId(id: string | undefined): id is DepartmentId {
  return !!id && (DEPARTMENT_IDS as readonly string[]).includes(id);
}

export function departmentBasePath(deptId: DepartmentId): string {
  return `/d/${deptId}`;
}

export function departmentAdminPath(deptId: DepartmentId): string {
  return `/admin/${deptId}`;
}
