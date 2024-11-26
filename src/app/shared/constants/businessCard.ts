import {University} from "./university";

export interface BusinessCard {
  name: string,
  lastName:string,
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
