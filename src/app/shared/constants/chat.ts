import {User} from "./user";

export interface Chat {
  name: string,
  photoId?: string,
  id: string
  createdAt: string,
  updatedAt: string,
  messages: Message[],
  users: User[]
}

export interface Message {
  id: string,
  chatId: string,
  createdAt: string,
  updatedAt: string,
  userId: string,
  content: string
}
