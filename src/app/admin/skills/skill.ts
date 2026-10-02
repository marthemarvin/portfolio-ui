export interface Skill {
  id: number;
  name: string;
  category: string;            // e.g. Backend, Database, DevOps
  icon: string | null;         // icon URL (uploaded to Cloudinary)
  displayOrder: number | null; // position inside its category, lowest first
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// What the backend accepts when creating or updating. A new image goes in the *Base64 field as a data URI; a skill.
export type SkillRequest = Omit<Skill, 'id' | 'createdAt' | 'updatedAt'> & { iconBase64: string | null };
