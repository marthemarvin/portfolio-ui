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

// What the backend accepts when creating or updating. A new image goes in the *Base64 field as a data URI; a course.
export type CourseRequest = Omit<Course, 'id' | 'createdAt' | 'updatedAt'> & { imageBase64: string | null };
