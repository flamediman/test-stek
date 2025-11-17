<template>
  <div v-if="error" class="error-message">
    <span>❌ {{ error }}</span>
    <button @click="handleRetry" class="btn-retry">Повторить</button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  retry: []
}>()

const handleRetry = () => {
  emit('retry')
}
</script>
