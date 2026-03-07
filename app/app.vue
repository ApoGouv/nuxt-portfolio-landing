<script setup lang="ts">
useHead({
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const layout = 'coming-soon';

const title = 'Cube Designs';
const description = 'Personal portfolio website, showcasing projects, skills and content by Apostolos Gouvalas.';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "~/assets/img/logo.svg",
  twitterImage: "~/assets/img/logo.svg",
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
