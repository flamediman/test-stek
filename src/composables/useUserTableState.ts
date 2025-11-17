import { ref, computed, watch, shallowRef, type Ref } from 'vue'
import type { User } from '@/types/user-table'
import { UserStatus, SortDirection, type UserRole as UserRoleType } from '@/types/user-table'
import { useTableFilter } from './useTableFilter'
import { useTableSort } from './useTableSort'
import { useTablePagination } from './useTablePagination'
import { useMockUsers } from './useMockUsers'

export function useUserTableState() {
  // Состояние данных
  const users = shallowRef<User[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  // Поиск и фильтрация
  const searchQuery = ref('')
  const filterRole = ref('')
  const filterStatus = ref('')
  const dateFrom = ref('')
  const dateTo = ref('')

  // Сортировка
  const sortColumn = ref<'id' | 'name' | 'email' | 'registrationDate' | 'lastActivity'>('id')
  const sortDirection = ref<SortDirection>(SortDirection.ASC)

  // Пагинация
  const currentPage = ref(1)
  const pageSize = ref(25)

  // Выбор строк
  const selectedUsers = ref<number[]>([])
  const showAllUsers = ref(false)

  // Модальные окна
  const showAddUserModal = ref(false)
  const showDetailsModal = ref(false)
  const selectedUser = ref<User | null>(null)

  // Composables
  const { filteredAndSearchedUsers } = useTableFilter(
    users,
    searchQuery,
    filterRole,
    filterStatus,
    dateFrom,
    dateTo,
  )

  const { sortedUsers, sortBy } = useTableSort(filteredAndSearchedUsers, sortColumn, sortDirection)

  const { totalPages, paginationStart, paginationEnd, paginatedUsers, visiblePages, goToPage } =
    useTablePagination(sortedUsers, currentPage, pageSize)

  const { generateMockUsers } = useMockUsers()

  // Computed
  const existingEmails = computed(() => {
    return users.value.map((u) => u.email)
  })

  // Watchers - сброс на первую страницу при изменении фильтров
  watch([searchQuery, filterRole, filterStatus, dateFrom, dateTo], () => {
    currentPage.value = 1
  })

  // Методы
  const loadUsers = async () => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      users.value = generateMockUsers(100)
    } catch (err) {
      error.value = 'Ошибка загрузки данных: ' + (err as Error).message
    } finally {
      isLoading.value = false
    }
  }

  const handleRetryLoad = async () => {
    await loadUsers()
  }

  const handleDeleteSelected = async () => {
    if (!confirm(`Вы уверены, что хотите удалить ${selectedUsers.value.length} пользователей?`)) {
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      users.value = users.value.filter((user) => !selectedUsers.value.includes(user.id))
      selectedUsers.value = []
    } catch (err) {
      alert('Ошибка удаления: ' + (err as Error).message)
    }
  }

  const handleOpenAddUser = () => {
    showAddUserModal.value = true
  }

  const handleCloseAddUserModal = () => {
    showAddUserModal.value = false
  }

  const handleAddNewUser = async (newUserData: {
    name: string
    email: string
    role: UserRoleType
    sendWelcomeEmail: boolean
  }) => {
    isSaving.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Math.max(...users.value.map((u) => u.id), 0) + 1,
        name: newUserData.name,
        email: newUserData.email,
        role: newUserData.role,
        status: UserStatus.ACTIVE,
        registrationDate: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        avatar: '',
        loginCount: 0,
        postsCount: 0,
        commentsCount: 0,
      }

      users.value = [newUser, ...users.value]
      handleCloseAddUserModal()
    } catch (err) {
      alert('Ошибка создания пользователя: ' + (err as Error).message)
    } finally {
      isSaving.value = false
    }
  }

  const openUserDetails = (user: User) => {
    selectedUser.value = user
    showDetailsModal.value = true
  }

  const handleCloseDetailsModal = () => {
    showDetailsModal.value = false
    selectedUser.value = null
  }

  const handleClearDateFilter = () => {
    dateFrom.value = ''
    dateTo.value = ''
  }

  const clearAllFilters = () => {
    searchQuery.value = ''
    filterRole.value = ''
    filterStatus.value = ''
    dateFrom.value = ''
    dateTo.value = ''
  }

  const handlePageSizeChange = () => {
    currentPage.value = 1
  }

  return {
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
  }
}
