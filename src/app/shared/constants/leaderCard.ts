import {University} from "./university";

export interface LeaderCard {
  name: string,
  lastName: string,
  id: string,
  role: string,
  title: string,
  university: University,
  department: string,
  email: string,
  phoneNumber: string,
  photoId?: string
  favourite: boolean
}

export interface DetailedLeaderCard extends LeaderCard {
  projects: LeaderProject[]
}

export interface LeaderProject {
  id: string
  name: string
  description: any
  photoId: any
  favourite: boolean
  availableSlots: number
  dueTo: any
  leadingUniversityId: string
  leaderId: string
  signedUsers: { id: string }[]
}
