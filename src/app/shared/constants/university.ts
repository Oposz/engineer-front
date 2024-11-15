import {Project} from "./project";
import {Leader} from "./leader";

export interface University {
  id: string,
  name: string,
  description: string,
  projects: Project[],
  photo?: string
  leaders: Leader[]
}
