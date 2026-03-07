
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
  ssr: true, // https://nuxt.com/docs/4.x/getting-started/deployment#static-hosting
  nitro: {
    preset: 'github-pages'
  },

  app: {
    // base URL for deployment
    // '/nuxt-portfolio-landing/' if using GitHub Pages repo via NUXT_APP_BASE_URL
    baseURL: '/nuxt-portfolio-landing/'
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