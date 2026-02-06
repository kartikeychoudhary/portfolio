/** Outgoing contact form request */
export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Incoming stored contact record */
export interface ContactDto {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  /** ISO datetime string */
  createdAt: string;
}
