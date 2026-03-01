<script setup>
  useHead({
    link: [
      { rel: 'icon', type: 'image/png', href: '/icons/favicon/favicon-96x96.png', sizes: '96x96' },
      { rel: 'icon', type: 'image/svg+xml', href: '/icons/favicon/favicon.svg' },
      { rel: 'shortcut icon', href: '/icons/favicon/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/icon/favicon/apple-touch-icon.png' },
      { rel: 'manifest', href: '/icons/favicon/site.webmanifest' },
    ],
    meta: [
      { name: 'apple-mobile-web-app-title', content: '2100' }
    ]
  })
</script>

<template>
  <NuxtPage />
</template>
