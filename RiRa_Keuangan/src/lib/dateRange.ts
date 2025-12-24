import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all'

export function getDateRange(period: Period) {
  const now = new Date()
  
  switch (period) {
    case 'daily':
      return { start: startOfDay(now).toISOString(), end: endOfDay(now).toISOString() }
    case 'weekly':
      // weekStartsOn: 1 artinya Senin
      return { start: startOfWeek(now, { weekStartsOn: 1 }).toISOString(), end: endOfWeek(now, { weekStartsOn: 1 }).toISOString() }
    case 'monthly':
      return { start: startOfMonth(now).toISOString(), end: endOfMonth(now).toISOString() }
    case 'yearly':
      return { start: startOfYear(now).toISOString(), end: endOfYear(now).toISOString() }
    default:
      return { start: null, end: null } // 'all' atau default ambil semua
  }
}