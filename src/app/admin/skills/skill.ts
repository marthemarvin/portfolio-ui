export interface Skill {
  id: number;
  name: string;
  category: string;            // e.g. Backend, Database, DevOps
  icon: string | null;         // icon URL
  displayOrder: number | null; // position inside its category, lowest first
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// What the backend accepts when creating or updating a skill.
export type SkillRequest = Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>;
