<script setup lang="ts">
useHead({
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: 'favicon.svg' },
    { rel: 'icon', href: 'favicon.ico' },
    { rel: 'canonical', href: 'https://apogouv.github.io/nuxt-portfolio-landing/' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const layout = 'coming-soon';

const title = 'CubeDesigns Boot Sequence – Interactive Nuxt Landing Demo';
const description = 'An interactive landing page prototype built with Nuxt 4 that simulates a gamified system boot sequence, terminal loading, power failure, and recovery experience for CubeDesigns.';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "/img/logo.svg",
  twitterImage: "/img/logo.svg",
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
