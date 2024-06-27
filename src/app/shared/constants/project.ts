export interface Project {
  id: string,
  name: string,
  description: string,
  enrolled: number,
  max_slots: number,
  end_date: string,
  photo?: string
}
