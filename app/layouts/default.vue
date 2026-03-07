<script setup lang="ts">
</script>

<template>
  <div>
    <AppHeader :links="navLinks" />
    
    <UMain>
      <slot />
    </UMain>
    
    <AppFooter />
  </div>
</template>

<style scoped>
</style>


