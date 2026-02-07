/**
 * Education Data Transfer Object
 */
export interface EducationDto {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  achievements: string[];
  gpa?: number;
  location?: string;
  major?: string;
}

/**
 * Experience Summary for About Section
 */
export interface ExperienceSummary {
  id: string;
  title: string;
  company: string;
  duration: string;
  isCurrent: boolean;
  description?: string;
}
