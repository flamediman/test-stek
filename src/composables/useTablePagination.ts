import { computed, watch, type Ref } from 'vue'
import type { User } from '@/types/user-table'

export function useTablePagination(
  users: Ref<User[]>,
  currentPage: Ref<number>,
  pageSize: Ref<number>,
) {
  const totalPages = computed(() => {
    return Math.ceil(users.value.length / pageSize.value)
  })

  const paginationStart = computed(() => {
    return (currentPage.value - 1) * pageSize.value + 1
  })

  const paginationEnd = computed(() => {
    const end = currentPage.value * pageSize.value
    return end > users.value.length ? users.value.length : end
  })

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return users.value.slice(start, end)
  })

  const visiblePages = computed(() => {
    const pages: (number | string)[] = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(total)
      } else if (current >= total - 3) {
        pages.push(1)
        pages.push('...')
        for (let i = total - 4; i <= total; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(total)
      }
    }

    return pages
  })

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Сбрасываем на первую страницу при изменении размера страницы
  watch(pageSize, () => {
    currentPage.value = 1
  })

  return {
    totalPages,
    paginationStart,
    paginationEnd,
    paginatedUsers,
    visiblePages,
    goToPage,
  }
}
