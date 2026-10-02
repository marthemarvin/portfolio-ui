export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// What a visitor sends from the Contact page.
export type ContactMessageRequest = Pick<ContactMessage, 'name' | 'email' | 'subject' | 'message'>;
