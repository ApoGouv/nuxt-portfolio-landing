<script setup lang="ts">
</script>

<template>
  <div class="cd-coming-soon-layout">
    <UMain class="cd-coming-soon">
      <slot />
    </UMain>
  </div>
</template>

<style scoped>
/* Override Nuxt UI header height so UMain = full height */
.cd-coming-soon-layout {
  --ui-header-height: 0px !important;
}
</style>


