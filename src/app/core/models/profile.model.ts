/** Social link associated with a profile */
export interface SocialLink {
  id: string;
  platform: 'linkedin' | 'github' | 'instagram' | 'twitter' | 'website' | 'youtube';
  url: string;
  /** CSS class for the icon, e.g. 'fa-brands fa-linkedin' */
  icon: string;
  /** Display label, e.g. 'LinkedIn' */
  label: string;
  sortOrder: number;
}

/** Profile data transfer object */
export interface ProfileDto {
  id: string;
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  tagline: string;
  /** Longer about text (HTML allowed) */
  bio: string;
  avatarUrl: string;
  /** Base64-encoded avatar image data (without data URI prefix) */
  avatarBase64?: string;
  /** MIME type for avatar (image/jpeg, image/png, image/webp) */
  avatarContentType?: string;
  /** Avatar file size in bytes */
  avatarFileSize?: number;
  resumeUrl: string;
  socialLinks: SocialLink[];
  createdAt?: string;
  updatedAt?: string;
}
