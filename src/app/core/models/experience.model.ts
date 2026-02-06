/** Experience data transfer object */
export interface ExperienceDto {
  id: string;
  company: string;
  companyLogo?: string;
  role: string;
  location: string;
  /** ISO date string, e.g. '2022-01-15' */
  startDate: string;
  /** ISO date string or null if current position */
  endDate: string | null;
  isCurrent: boolean;
  /** HTML description allowed */
  description: string;
  technologies: string[];
  sortOrder: number;
}
