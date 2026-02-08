/** Project data transfer object */
export interface ProjectDto {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  liveUrl?: string;
  repoUrl?: string;
  technologies: string[];
  featured: boolean;
  sortOrder: number;
  /** Base64-encoded thumbnail image data (without data URI prefix) */
  thumbnailBase64?: string;
  /** MIME type for thumbnail (image/jpeg, image/png, image/webp) */
  thumbnailContentType?: string;
  /** Thumbnail file size in bytes */
  thumbnailFileSize?: number;
}
