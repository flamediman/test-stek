import { computed, type Ref } from 'vue'
import type { User } from '@/types/user-table'

type SortColumn = 'id' | 'name' | 'email' | 'registrationDate' | 'lastActivity'
type SortDirection = 'asc' | 'desc'

export function useTableSort(
  users: Ref<User[]>,
  sortColumn: Ref<SortColumn>,
  sortDirection: Ref<SortDirection>,
) {
  const sortedUsers = computed(() => {
    const usersCopy = [...users.value]

    usersCopy.sort((a, b) => {
      let aVal = a[sortColumn.value]
      let bVal = b[sortColumn.value]

      if (sortColumn.value === 'registrationDate' || sortColumn.value === 'lastActivity') {
        aVal = new Date(aVal as string).getTime()
        bVal = new Date(bVal as string).getTime()
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = (bVal as string).toLowerCase()
      }

      if (aVal < bVal) {
        return sortDirection.value === 'asc' ? -1 : 1
      }
      if (aVal > bVal) {
        return sortDirection.value === 'asc' ? 1 : -1
      }
      return 0
    })

    return usersCopy
  })

  const sortBy = (column: SortColumn) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = column
      sortDirection.value = 'asc'
    }
  }

  return {
    sortedUsers,
    sortBy,
  }
}
