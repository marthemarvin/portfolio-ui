export interface Experience {
  id: number;
  companyName: string;
  position: string;
  location: string | null;
  startDate: string;        // 'YYYY-MM-DD'
  endDate: string | null;   // null means this is the current job
  description: string | null;
  companyLogo: string | null;
  companyLink: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// What the backend accepts when creating or updating an experience.
export type ExperienceRequest = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>;
