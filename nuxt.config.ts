// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/styles/index.scss"],
  runtimeConfig: {
    public: {
      socketUrl: process.env.SOCKET_URL || "http://localhost:4000",
    },
  },
  modules: ["@pinia/nuxt"],
});
