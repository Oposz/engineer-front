import {User} from "./user";

export interface Chat {
  name: string,
  photoId?: string,
  id: string
  createdAt: string,
  updatedAt: string,
  messages: Message[],
  users: User[]
  views: ChatViews[]
}

export interface Message {
  id: string,
  chatId: string,
  createdAt: string,
  updatedAt: string,
  userId: string,
  content: string
  new: boolean
}

export interface ChatViews {
  id: string,
  chatId: string,
  userId: string,
  lastSeen: string,
  updatedAt: string
}
