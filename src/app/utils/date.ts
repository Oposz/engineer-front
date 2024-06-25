export function getDate(date: string) {
  const endDate = new Date(date)
  const day = endDate.getUTCDate()
  const month = endDate.getUTCMonth() + 1
  const year = endDate.getUTCFullYear()
  return `${day}/${month}/${year}`
}

export function getRemainingDays(date: string) {
  const endDate = new Date(date)
  const now = new Date(Date.now())
  return Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}
