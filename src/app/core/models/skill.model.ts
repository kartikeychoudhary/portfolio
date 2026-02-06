/** Skill category type */
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other';

/** Skill data transfer object */
export interface SkillDto {
  id: string;
  name: string;
  /** CSS class for the icon, e.g. 'fa-brands fa-angular' */
  icon: string;
  category: SkillCategory;
  /** Proficiency level from 1 to 100 */
  proficiency: number;
  sortOrder: number;
}
