export interface Match {
  date: string
  team: string
  group: string
  isDomicile: boolean
  time_start: string
  time_meetup: string | null
  opponent: string | null
  location: string | null
  board_official: string[]
  referees: string[]
  bar: string | null
  result: number[]
}
