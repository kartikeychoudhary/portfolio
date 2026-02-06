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
  tagline: string;
  /** Longer about text (HTML allowed) */
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  socialLinks: SocialLink[];
}
