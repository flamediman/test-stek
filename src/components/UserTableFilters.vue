<template>
  <div class="filters-section">
    <div class="filter-group">
      <label>Статус:</label>
      <button
        :class="['filter-btn', { active: filterStatus === '' }]"
        @click="handleStatusChange('')"
      >
        Все
      </button>
      <button
        :class="['filter-btn', { active: filterStatus === UserStatus.ACTIVE }]"
        @click="handleStatusChange(UserStatus.ACTIVE)"
      >
        Активные
      </button>
      <button
        :class="['filter-btn', { active: filterStatus === UserStatus.INACTIVE }]"
        @click="handleStatusChange(UserStatus.INACTIVE)"
      >
        Неактивные
      </button>
    </div>

    <div class="filter-group">
      <label>Дата регистрации:</label>
      <input v-model="dateFrom" type="date" class="date-input" />
      <span>-</span>
      <input v-model="dateTo" type="date" class="date-input" />
      <button @click="handleClearDateFilter" class="btn-clear">Очистить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UserStatus } from '@/types/user-table'

interface Props {
  filterStatus: string
  dateFrom: string
  dateTo: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:filterStatus': [value: string]
  'update:dateFrom': [value: string]
  'update:dateTo': [value: string]
  clearDateFilter: []
}>()

const dateFrom = computed({
  get: () => props.dateFrom,
  set: (value) => emit('update:dateFrom', value),
})

const dateTo = computed({
  get: () => props.dateTo,
  set: (value) => emit('update:dateTo', value),
})

const handleStatusChange = (status: string) => {
  emit('update:filterStatus', status)
}

const handleClearDateFilter = () => {
  emit('update:dateFrom', '')
  emit('update:dateTo', '')
  emit('clearDateFilter')
}
</script>
