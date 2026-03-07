
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint', 
    '@nuxt/ui'
  ],

  devtools: { 
    enabled: true 
  },

  css: ['~/assets/css/main.css'],

  // Static generation / prerender
  ssr: true, // enable SSR for hydration
  nitro: {
    preset: 'static'
  },

  app: {
    // base URL for deployment
    // '/nuxt-portfolio-landing/' if using GitHub Pages repo
    baseURL: process.env.BASE_URL || '/' // fallback to '/' if env not set
  },

  routeRules: {
    '/': { prerender: true } // pre-render the landing page
  },

  compatibilityDate: '2025-07-15',

   eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})