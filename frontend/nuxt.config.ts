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
    apiBase: process.env.NUXT_API_BASE || "http://main-back:8000/api",
    public: {
      // Base que utilitza el navegador (fora de Docker)
      apiBaseBrowser:
        process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000/api",
      socketsBase:
        process.env.NUXT_PUBLIC_SOCKETS_BASE || "http://localhost:4000",
    },
  },
});
