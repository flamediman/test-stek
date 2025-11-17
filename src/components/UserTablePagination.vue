<template>
  <div v-if="!isLoading" class="pagination">
    <div class="pagination-info">
      Показано {{ paginationStart }} - {{ paginationEnd }} из {{ totalCount }}
    </div>

    <div class="pagination-controls">
      <button @click="handleGoToPage(1)" :disabled="currentPage === 1" class="btn-page">⏮️</button>
      <button
        @click="handleGoToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="btn-page"
      >
        ◀️
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="handleGoToPage(page)"
        :class="['btn-page', { active: currentPage === page }]"
      >
        {{ page }}
      </button>

      <button
        @click="handleGoToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="btn-page"
      >
        ▶️
      </button>
      <button
        @click="handleGoToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="btn-page"
      >
        ⏭️
      </button>
    </div>

    <div class="page-size-selector">
      <label>На странице:</label>
      <select v-model="pageSize">
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isLoading: boolean
  paginationStart: number
  paginationEnd: number
  totalCount: number
  currentPage: number
  totalPages: number
  visiblePages: (number | string)[]
  pageSize: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:pageSize': [value: number]
  'update:currentPage': [value: number]
  goToPage: [page: number]
  pageSizeChange: []
}>()

const pageSize = computed({
  get: () => props.pageSize,
  set: (value) => {
    emit('update:pageSize', value)
    emit('pageSizeChange')
  },
})

const handleGoToPage = (page: number | string) => {
  if (typeof page === 'string') return
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
    emit('goToPage', page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>
