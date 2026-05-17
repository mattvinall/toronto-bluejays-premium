import type { Directive } from 'vue'

export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-revealed')
      return
    }
    el.classList.add('reveal-pending')
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('is-revealed')
            obs.unobserve(el)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    )
    obs.observe(el)
  }
}
