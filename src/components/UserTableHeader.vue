<template>
  <div class="table-header">
    <div class="header-left">
      <h2>{{ title }}</h2>
      <span class="total-count">{{ totalCount }} записей</span>
    </div>

    <div class="header-right">
      <input
        :value="searchQuery"
        @input="handleSearchInput"
        type="text"
        placeholder="Поиск по имени, email..."
        class="search-input"
      />

      <select :value="filterRole" @change="handleRoleChange" class="role-filter">
        <option value="">Все роли</option>
        <option :value="UserRole.ADMIN">Администратор</option>
        <option :value="UserRole.USER">Пользователь</option>
        <option :value="UserRole.MODERATOR">Модератор</option>
      </select>

      <button @click="handleOpenAddUser" class="btn btn-primary" :disabled="isLoading">
        + Добавить пользователя
      </button>

      <button
        @click="handleExport"
        class="btn btn-secondary"
        :disabled="isLoading || (selectedUsers.length === 0 && !showAllUsers)"
      >
        📥 Экспорт
      </button>

      <button v-if="selectedUsers.length > 0" @click="handleDeleteSelected" class="btn btn-danger">
        🗑️ Удалить выбранные ({{ selectedUsers.length }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserRole, type User } from '@/types/user-table'
import { getRoleLabel, getUserStatusText } from '@/utils/user'
import { formatDate } from '@/utils/formatters'
import { debounce } from '@/utils/debounce'

interface Props {
  title: string
  totalCount: number
  searchQuery: string
  filterRole: string
  isLoading: boolean
  selectedUsers: number[]
  showAllUsers: boolean
  users: User[]
  sortedUsers: User[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterRole': [value: string]
  openAddUser: []
  deleteSelected: []
}>()

const debouncedUpdateSearch = debounce((value: string) => {
  emit('update:searchQuery', value)
}, 300)

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  debouncedUpdateSearch(target.value)
}

const handleRoleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:filterRole', target.value)
}

const handleOpenAddUser = () => {
  emit('openAddUser')
}

const handleExport = () => {
  const usersToExport =
    props.selectedUsers.length > 0 && !props.showAllUsers
      ? props.sortedUsers.filter((u) => props.selectedUsers.includes(u.id))
      : props.sortedUsers

  const headers = ['ID', 'Имя', 'Email', 'Роль', 'Статус', 'Дата регистрации']
  const rows = usersToExport.map((user) => [
    user.id,
    user.name,
    user.email,
    getRoleLabel(user.role),
    getUserStatusText(user.status),
    formatDate(user.registrationDate),
  ])

  let csv = headers.join(',') + '\n'
  rows.forEach((row) => {
    csv += row.map((cell) => `"${String(cell)}"`).join(',') + '\n'
  })

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `users_export_${new Date().getTime()}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

const handleDeleteSelected = () => {
  emit('deleteSelected')
}
</script>
