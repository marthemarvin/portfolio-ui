export interface About {
  id: number;
  fullName: string | null;
  headline: string | null;
  bio: string | null;
  image: string | null;
  location: string | null;
  email: string | null;
  resumeLink: string | null;
  githubLink: string | null;
  linkedinLink: string | null;
  createdAt: string;
  updatedAt: string;
}

// What the backend accepts when saving.
export type AboutRequest = Omit<About, 'id' | 'createdAt' | 'updatedAt'>;
