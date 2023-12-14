<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <main class="d-flex flex-column">
    <NavBar />
    <RouterView class="r" />
  </main>
</template>

<style scoped lang="scss">
.r {
  margin-top: 50px !important;
}
</style>
