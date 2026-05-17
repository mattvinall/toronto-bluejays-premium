import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCompareStore } from '~/stores/compare'

describe('useCompareStore', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('starts empty', () => {
    const s = useCompareStore()
    expect(s.slugs).toEqual([])
    expect(s.count).toBe(0)
  })

  it('add() adds a slug', () => {
    const s = useCompareStore()
    expect(s.add('a')).toBe(true)
    expect(s.slugs).toEqual(['a'])
  })

  it('add() refuses duplicates', () => {
    const s = useCompareStore()
    s.add('a')
    expect(s.add('a')).toBe(false)
    expect(s.slugs).toEqual(['a'])
  })

  it('add() refuses past MAX', () => {
    const s = useCompareStore()
    s.add('a'); s.add('b'); s.add('c'); s.add('d')
    expect(s.add('e')).toBe(false)
    expect(s.count).toBe(4)
  })

  it('toggle() adds then removes', () => {
    const s = useCompareStore()
    s.toggle('a')
    expect(s.has('a').value).toBe(true)
    s.toggle('a')
    expect(s.has('a').value).toBe(false)
  })
})
