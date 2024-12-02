import {Project} from "./project";
import {Leader} from "./leader";

export interface University {
  id: string,
  name: string,
  description: string,
  favourite: boolean,
  photoId?: string,
}

export interface UniversityWithLeaders extends University {
  leaders: Leader[]
}

export interface UniversityWithProjects extends University {
  projects: Project[]
}

export interface DetailedUniversity extends University {
  projects: Project[],
  leaders: Leader[],
  users: string[],
}
