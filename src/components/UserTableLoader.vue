<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <p>Загрузка данных...</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isLoading: boolean
}

defineProps<Props>()
</script>
