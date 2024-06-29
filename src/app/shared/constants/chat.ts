export interface Chat {
  name: string,
  photo?: string,
  id: string
  lastMsg: string,
  messages: Message[]
}

export interface Message {
  userID: string,
  content: string
}
