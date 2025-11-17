<template>
  <div class="user-table-container">
    <UserTableHeader
      title="Управление пользователями"
      :total-count="filteredAndSearchedUsers.length"
      v-model:searchQuery="searchQuery"
      v-model:filterRole="filterRole"
      :is-loading="isLoading"
      :selected-users="selectedUsers"
      :show-all-users="showAllUsers"
      :users="users"
      :sorted-users="sortedUsers"
      @openAddUser="handleOpenAddUser"
      @deleteSelected="handleDeleteSelected"
    />

    <UserTableFilters
      v-model:filterStatus="filterStatus"
      v-model:dateFrom="dateFrom"
      v-model:dateTo="dateTo"
      @clearDateFilter="handleClearDateFilter"
    />

    <TheLoader :is-loading="isLoading" />
    <TheError :error="error" @retry="handleRetryLoad" />

    <UserTable
      v-if="!isLoading && !error"
      :users="paginatedUsers"
      :all-users="users"
      v-model:selected-users="selectedUsers"
      :is-saving="isSaving"
      :sort-column="sortColumn"
      :sort-direction="sortDirection"
      @sort-by="sortBy"
      @open-user-details="openUserDetails"
      @clear-all-filters="clearAllFilters"
      @update:users="users = $event"
      @update:is-saving="isSaving = $event"
      @delete-selected="handleDeleteSelected"
    />

    <UserTablePagination
      :is-loading="isLoading"
      :pagination-start="paginationStart"
      :pagination-end="paginationEnd"
      :total-count="filteredAndSearchedUsers.length"
      v-model:current-page="currentPage"
      :total-pages="totalPages"
      :visible-pages="visiblePages"
      v-model:page-size="pageSize"
      @go-to-page="goToPage"
      @page-size-change="handlePageSizeChange"
    />

    <UserTableAddUserModal
      :show-modal="showAddUserModal"
      :is-saving="isSaving"
      :existing-emails="existingEmails"
      @close="handleCloseAddUserModal"
      @submit="handleAddNewUser"
    />

    <UserTableDetailsModal
      v-if="selectedUser"
      :selected-user="selectedUser"
      :show-modal="showDetailsModal"
      @close="handleCloseDetailsModal"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import UserTableHeader from '@/components/UserTableHeader.vue'
import UserTableFilters from '@/components/UserTableFilters.vue'
import UserTablePagination from '@/components/UserTablePagination.vue'
import UserTableAddUserModal from '@/components/UserTableAddUserModal.vue'
import UserTableDetailsModal from '@/components/UserTableDetailsModal.vue'
import UserTable from '@/components/UserTable.vue'
import TheLoader from '@/components/UserTableLoader.vue'
import TheError from '@/components/UserTableError.vue'
import { useUserTableState } from '@/composables/useUserTableState'

const {
  // Состояние
  users,
  isLoading,
  isSaving,
  error,
  searchQuery,
  filterRole,
  filterStatus,
  dateFrom,
  dateTo,
  sortColumn,
  sortDirection,
  currentPage,
  pageSize,
  selectedUsers,
  showAllUsers,
  showAddUserModal,
  showDetailsModal,
  selectedUser,
  // Computed
  filteredAndSearchedUsers,
  sortedUsers,
  totalPages,
  paginationStart,
  paginationEnd,
  paginatedUsers,
  visiblePages,
  existingEmails,
  // Методы
  loadUsers,
  handleRetryLoad,
  handleDeleteSelected,
  handleOpenAddUser,
  handleCloseAddUserModal,
  handleAddNewUser,
  openUserDetails,
  handleCloseDetailsModal,
  handleClearDateFilter,
  clearAllFilters,
  handlePageSizeChange,
  sortBy,
  goToPage,
} = useUserTableState()

onMounted(() => {
  loadUsers()
})
</script>
