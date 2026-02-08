export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface SiteSettingsDto {
  id?: string;
  avatarSize: AvatarSize;
  accentColor: string;
  fontFamily: string;
  heroVisible: boolean;
  aboutVisible: boolean;
  skillsVisible: boolean;
  experienceVisible: boolean;
  projectsVisible: boolean;
  contactVisible: boolean;
}

export const AVATAR_SIZE_MAP: Record<AvatarSize, string> = {
  small: '8rem',
  medium: '10rem',
  large: '12rem',
  xlarge: '14rem',
};

export const FONT_OPTIONS = [
  { label: 'Space Grotesk', value: 'Space Grotesk' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Montserrat', value: 'Montserrat' },
];

export const ACCENT_PRESETS = [
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Green', value: '#10b981' },
  { label: 'Teal', value: '#14b8a6' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Indigo', value: '#6366f1' },
];

export const DEFAULT_SETTINGS: SiteSettingsDto = {
  avatarSize: 'medium',
  accentColor: '#3b82f6',
  fontFamily: 'Space Grotesk',
  heroVisible: true,
  aboutVisible: true,
  skillsVisible: true,
  experienceVisible: true,
  projectsVisible: true,
  contactVisible: true,
};
