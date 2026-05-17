import scheduleData from '~/data/schedule-2026.json'
import type { Game } from '~/types/game'

export function useSchedule() {
  const games = ref<Game[]>(scheduleData as Game[])

  const upcomingGames = computed(() => {
    const now = new Date()
    return games.value
      .filter(g => new Date(g.date) >= now)
      .sort((a, b) => a.date.localeCompare(b.date))
  })

  const getGameById = (id: string): Game | undefined =>
    games.value.find(g => g.id === id)

  const gamesByMonth = computed(() => {
    const map = new Map<string, Game[]>()
    for (const g of games.value) {
      const month = g.date.slice(0, 7)
      if (!map.has(month)) map.set(month, [])
      map.get(month)!.push(g)
    }
    return map
  })

  return { games, upcomingGames, gamesByMonth, getGameById }
}
