import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSchedule } from '~/composables/useSchedule'

describe('useSchedule', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-01T00:00:00Z'))
  })

  it('returns all games', () => {
    const { games } = useSchedule()
    expect(games.value.length).toBeGreaterThan(0)
  })

  it('upcomingGames excludes past games', () => {
    const { upcomingGames } = useSchedule()
    const allFuture = upcomingGames.value.every(g => new Date(g.date) >= new Date('2026-06-01'))
    expect(allFuture).toBe(true)
  })

  it('upcomingGames is sorted ascending by date', () => {
    const { upcomingGames } = useSchedule()
    const dates = upcomingGames.value.map(g => g.date)
    const sorted = [...dates].sort()
    expect(dates).toEqual(sorted)
  })

  it('getGameById finds a game', () => {
    const { getGameById } = useSchedule()
    const game = getGameById('2026-07-04-tor-bal')
    expect(game?.opponent).toBe('Baltimore Orioles')
  })
})
