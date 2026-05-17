import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  experimental: {
    viewTransition: true
  },
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        strict: true,
        noUncheckedIndexedAccess: true,
        noImplicitOverride: true,
        noFallthroughCasesInSwitch: true
      }
    }
  },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt'
  ],
  image: {
    format: ['avif', 'webp'],
    screens: { sm: 480, md: 768, lg: 1280, xl: 1920 }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Blue Jays Premium',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Premium experiences at the renovated Rogers Centre.' }
      ]
    }
  }
})
