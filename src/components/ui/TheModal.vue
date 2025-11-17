<template>
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal modal-large">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button @click="closeModal" class="btn-close">✕</button>
      </div>

      <div class="modal-body">
        <slot></slot>
      </div>

      <div class="modal-footer">
        <slot v-if="$slots.footer" name="footer"></slot>
        <button v-else @click="closeModal" class="btn btn-secondary">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showModal: boolean
  title: string
  showBody?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const closeModal = () => {
  emit('close')
}
</script>
