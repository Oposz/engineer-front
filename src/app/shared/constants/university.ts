import {Project} from "./project";

export interface University {
  id: string,
  name: string,
  description: string,
  projects: Project[],
  photo?: string
}
