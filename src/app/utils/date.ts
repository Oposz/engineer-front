export function getDate(date: string) {
  const endDate = new Date(date);
  const localDate = endDate.toLocaleDateString('pl-PL');
  return localDate.replace(/\./g, '/');
}

export function getRemainingDays(date: string) {
  const endDate = new Date(date);
  const now = new Date();
  endDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const differenceInTime = endDate.getTime() - now.getTime();
  return Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
}
