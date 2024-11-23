import {University} from "./university";

export interface User {
  id: string
  email: string
  name: string
  lastName: string
  universities: University[]
}
