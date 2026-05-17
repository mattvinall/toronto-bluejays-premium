import { vReveal } from '~/directives/reveal'

export default defineNuxtPlugin((app) => {
  app.vueApp.directive('reveal', vReveal)
})
