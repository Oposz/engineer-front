import {University} from "./university";

export interface User {
  id: number
  email: string
  name: string
  lastName: string
  universityId: number
  university: University
}
