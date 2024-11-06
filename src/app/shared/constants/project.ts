import {User} from "./user";

export interface Project {
  id: string
  name: string
  description: string
  photo?: string
  favourite: boolean
  availableSlots: number
  dueTo?: string
  universityId: string
  signedUsers: User[]
}
