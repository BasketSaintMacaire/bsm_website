import type { DaySchedule } from './DaySchedule'

export interface WeekSchedule {
  name: string
  period?: string | null
  days: DaySchedule[]
}
