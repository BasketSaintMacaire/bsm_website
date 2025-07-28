import type { TrainingSession } from './TrainingSession'

export interface DaySchedule {
  date: string
  sessions: TrainingSession[]
}
