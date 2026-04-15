// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["~/assets/css/tailwind.css"],
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
  },
runtimeConfig: {
    // Base interna (dins Docker) per a SSR i codi de servidor
    apiBase: process.env.NUXT_API_BASE,
    socketsBase: process.env.NUXT_SOCKET_URL,
    public: {
      apiBaseBrowser: process.env.NUXT_API_BASE,
      imagesBaseBrowser: process.env.NUXT_IMAGES_BASE,
      socketsBaseBrowser: process.env.NUXT_SOCKET_URL,
    },
  },
  },
});
