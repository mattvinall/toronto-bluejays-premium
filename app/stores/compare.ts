import { defineStore } from 'pinia'

export const useCompareStore = defineStore('compare', () => {
  const slugs = ref<string[]>([])
  const MAX = 4

  const add = (slug: string): boolean => {
    if (slugs.value.length >= MAX) return false
    if (slugs.value.includes(slug)) return false
    slugs.value.push(slug)
    return true
  }

  const remove = (slug: string): void => {
    slugs.value = slugs.value.filter(s => s !== slug)
  }

  const toggle = (slug: string): void => {
    if (slugs.value.includes(slug)) remove(slug)
    else add(slug)
  }

  const has = (slug: string): boolean => slugs.value.includes(slug)
  const count = computed(() => slugs.value.length)

  return { slugs, add, remove, toggle, has, count, MAX }
}, {
  persist: true
})
