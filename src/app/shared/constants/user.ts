import {UniversityWithProjects} from "./university";

export interface User {
  id: string
  email: string
  name: string
  lastName: string
  universities: UniversityWithProjects[]
}
