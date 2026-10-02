export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;          // 'YYYY-MM-DD'
  expiryDate: string | null;  // null means it does not expire
  credentialId: string | null;
  credentialUrl: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// What the backend accepts when creating or updating a certificate.
export type CertificateRequest = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>;
