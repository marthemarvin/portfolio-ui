export interface Course {
  id: number;
  title: string;
  description: string | null;
  author: string | null;
  link: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// What the backend accepts when creating or updating a course.
export type CourseRequest = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>;
