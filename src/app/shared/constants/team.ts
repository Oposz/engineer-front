export interface Team {
  id: string
  name: string
  description: string
  photoId: string
  favourite: boolean
  availableSlots: number
  dueTo: string
  universityId: string
  leadingUniversityName: string
  leader: TeamLeader
  signedUsers: string[]
  role: string
}

interface TeamLeader {
  name: string
  lastName: string
}
