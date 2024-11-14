import {Leader} from "./leader";

export interface Project {
  id: string
  name: string
  description: string
  photo: string
  favourite: boolean
  availableSlots: number
  dueTo?: string
  universityId: string
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

interface Sponsor {
  id: string
  name: string,
  description: string,
  photo: string
}

export interface DefinedPositionWithAvailability extends DefinedPosition {
  taken: boolean
}
