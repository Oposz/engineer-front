import {Leader} from "./leader";
import {University} from "./university";

export interface CreatedProject {
  id: string
  name: string
  description: string
  photo: string
  favourite: boolean
  availableSlots: number
  dueTo?: string
  universityId: string
  leaderId: string
}

export interface Project {
  id: string
  name: string
  description: string
  photoId: string
  favourite: boolean
  availableSlots: number
  dueTo?: string
  leadingUniversityId: string
  leaderId: string
  signedUsers: SignedUser[]
  definedPositions: DefinedPosition[]
  takenPositions: TakenPosition[]
  leader: Leader
  sponsors: Sponsor[]
}

interface SignedUser {
  id: string
  lastName: string
  name: string
}

interface DefinedPosition {
  id: string
  name: string
  quantity: number
  description: string
  projectId: string
}

interface TakenPosition {
  id: string
  name: string
  userId: string
  projectId: string
  definedPositionId: string
}

export interface Sponsor {
  id: string
  name: string,
  description: string,
  photoId: string
}

export interface DefinedPositionWithAvailability extends DefinedPosition {
  closedSlots: number
}

export interface ProjectWithUni extends Project{
  leadingUniversity:University
}
