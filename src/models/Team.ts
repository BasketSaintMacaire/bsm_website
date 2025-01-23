export interface Team {
  id: number
  name: string
  image: string
  players: Player[]
  category: 'men' | 'women' | 'pleasure'
}

export interface Player {
  id: number
  name: string
  position: string
  number: number
}
