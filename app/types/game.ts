export type GameTier = 'marquee' | 'premium' | 'standard'

export interface Game {
  id: string
  date: string
  opponent: string
  opponentLogo: string
  isHome: boolean
  firstPitch: string
  promotion?: string
  tier: GameTier
}
