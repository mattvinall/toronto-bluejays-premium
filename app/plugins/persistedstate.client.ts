import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(({ $pinia }) => {
  ($pinia as ReturnType<typeof import('pinia').createPinia>).use(piniaPluginPersistedstate)
})
