export interface Team {
  id: string,
  name: string,
  description: string,
  university: string,
  manager: string,
  role: string,
  enrolled: number,
  max_slots: number,
  end_date: string,
  photo?: string
}
