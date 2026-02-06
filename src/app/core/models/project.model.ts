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
}
