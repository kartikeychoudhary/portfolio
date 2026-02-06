/** Blog data transfer object */
export interface BlogDto {
  id: string;
  title: string;
  slug: string;
  /** Short preview text */
  excerpt: string;
  /** Full HTML content */
  content: string;
  coverImage: string;
  tags: string[];
  published: boolean;
  publishedDate: string | null;
  readingTime: number | null;
  createdAt: string;
  updatedAt: string;
}
