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

// What the backend accepts when creating or updating. A new image goes in the *Base64 field as a data URI; an experience.
export type ExperienceRequest = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'> & { companyLogoBase64: string | null };
