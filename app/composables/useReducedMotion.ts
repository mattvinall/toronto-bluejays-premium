import { usePreferredReducedMotion } from '@vueuse/core'

export function useReducedMotion() {
  const pref = usePreferredReducedMotion()
  return computed(() => pref.value === 'reduce')
}
