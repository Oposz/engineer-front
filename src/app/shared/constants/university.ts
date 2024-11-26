import {Project} from "./project";
import {Leader} from "./leader";

export interface University {
  id: string,
  name: string,
  description: string,
  projects: Project[],
  favourite: boolean,
  photoId?: string
  leaders: Leader[]
}
