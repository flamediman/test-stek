<template>
  <div v-if="users.length === 0" class="no-data">
    <p>😔 Нет данных для отображения</p>
    <button @click="clearAllFilters" class="btn btn-primary">Сбросить фильтры</button>
  </div>

  <div v-else class="table-wrapper">
    <table class="user-table">
      <thead>
        <tr>
          <th>
            <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
          </th>
          <th
            @click="emit('sortBy', 'id')"
            :class="{ sortable: true, active: sortColumn === 'id' }"
          >
            ID
            <span v-if="sortColumn === 'id'">
              {{ sortDirectionArrow }}
            </span>
          </th>
          <th
            @click="emit('sortBy', 'name')"
            :class="{ sortable: true, active: sortColumn === 'name' }"
          >
            Имя
            <span v-if="sortColumn === 'name'">
              {{ sortDirectionArrow }}
            </span>
          </th>
          <th
            @click="emit('sortBy', 'email')"
            :class="{ sortable: true, active: sortColumn === 'email' }"
          >
            Email
            <span v-if="sortColumn === 'email'">
              {{ sortDirectionArrow }}
            </span>
          </th>
          <th>Роль</th>
          <th>Статус</th>
          <th
            @click="emit('sortBy', 'registrationDate')"
            :class="{ sortable: true, active: sortColumn === 'registrationDate' }"
          >
            Дата регистрации
            <span v-if="sortColumn === 'registrationDate'">
              {{ sortDirectionArrow }}
            </span>
          </th>
          <th>Последняя активность</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          :class="{
            selected: selectedUsers.includes(user.id),
            editing: editingUserId === user.id,
            inactive: user.status === UserStatus.INACTIVE,
          }"
        >
          <td>
            <input
              type="checkbox"
              :checked="selectedUsers.includes(user.id)"
              @change="toggleSelectUser(user.id)"
            />
          </td>
          <td>{{ user.id }}</td>
          <td>
            <div v-if="editingUserId === user.id">
              <input v-model="localEditForm.name" type="text" class="edit-input" />
            </div>
            <div v-else class="user-name-cell">
              <img :src="getUserAvatar(user.avatar, user.name)" :alt="user.name" class="avatar" />
              <span>{{ user.name }}</span>
            </div>
          </td>
          <td>
            <div v-if="editingUserId === user.id">
              <input v-model="localEditForm.email" type="email" class="edit-input" />
            </div>
            <div v-else>{{ user.email }}</div>
          </td>
          <td>
            <div v-if="editingUserId === user.id">
              <select v-model="localEditForm.role" class="edit-select">
                <option :value="UserRole.ADMIN">Администратор</option>
                <option :value="UserRole.USER">Пользователь</option>
                <option :value="UserRole.MODERATOR">Модератор</option>
              </select>
            </div>
            <div v-else>
              <span :class="['role-badge', 'role-' + user.role]">
                {{ getRoleLabel(user.role) }}
              </span>
            </div>
          </td>
          <td>
            <span
              :class="[
                'status-badge',
                user.status === UserStatus.ACTIVE ? 'status-active' : 'status-inactive',
              ]"
              @click="toggleUserStatus(user.id)"
              :style="{ cursor: 'pointer' }"
            >
              {{ getUserStatusText(user.status) }}
            </span>
          </td>
          <td>{{ formatDate(user.registrationDate) }}</td>
          <td>
            <span :class="getActivityClass(user.lastActivity)">
              {{ formatRelativeTime(user.lastActivity) }}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button
                v-if="editingUserId !== user.id"
                @click="startEdit(user)"
                class="btn-icon"
                title="Редактировать"
              >
                ✏️
              </button>
              <button
                v-if="editingUserId === user.id"
                @click="saveEdit(user.id)"
                class="btn-icon btn-success"
                :disabled="isSaving"
                title="Сохранить"
              >
                ✓
              </button>
              <button
                v-if="editingUserId === user.id"
                @click="cancelEdit"
                class="btn-icon btn-cancel"
                title="Отмена"
              >
                ✗
              </button>
              <button
                v-if="editingUserId !== user.id"
                @click="emit('openUserDetails', user)"
                class="btn-icon"
                title="Подробнее"
              >
                👁️
              </button>
              <button
                v-if="editingUserId !== user.id"
                @click="deleteUser(user.id)"
                class="btn-icon btn-danger"
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import type { SortDirection, User } from '@/types/user-table'
import { UserStatus, UserRole } from '@/types/user-table'
import { getRoleLabel, getUserAvatar, getUserStatusText } from '@/utils/user'
import { formatDate, formatRelativeTime } from '@/utils/formatters'

interface Props {
  users: User[]
  allUsers: User[]
  selectedUsers: number[]
  isSaving?: boolean
  sortColumn: 'id' | 'name' | 'email' | 'registrationDate' | 'lastActivity'
  sortDirection: SortDirection
}

const props = withDefaults(defineProps<Props>(), {
  isSaving: false,
})

const emit = defineEmits<{
  'update:users': [users: User[]]
  'update:selectedUsers': [users: number[]]
  'update:isSaving': [value: boolean]
  sortBy: [column: 'id' | 'name' | 'email' | 'registrationDate' | 'lastActivity']
  openUserDetails: [user: User]
  clearAllFilters: []
  deleteSelected: []
}>()

const isAllSelected = computed(() => {
  return (
    props.users.length > 0 && props.users.every((user) => props.selectedUsers.includes(user.id))
  )
})

const sortDirectionArrow = computed(() => {
  return props.sortDirection === 'asc' ? '↑' : '↓'
})

const editingUserId = ref<null | number>(null)

const localEditForm = ref({
  name: '',
  email: '',
  role: UserRole.USER,
})

watch(
  () => editingUserId.value,
  (newId) => {
    if (newId !== null) {
      const user = props.users.find((u) => u.id === newId)
      if (user) {
        localEditForm.value = {
          name: user.name,
          email: user.email,
          role: user.role,
        }
      }
    } else {
      localEditForm.value = {
        name: '',
        email: '',
        role: UserRole.USER,
      }
    }
  },
)

const toggleSelectUser = (userId: number) => {
  const newSelectedUsers = [...props.selectedUsers]
  const index = newSelectedUsers.indexOf(userId)
  if (index > -1) {
    newSelectedUsers.splice(index, 1)
  } else {
    newSelectedUsers.push(userId)
  }
  emit('update:selectedUsers', newSelectedUsers)
}

const toggleSelectAll = () => {
  const newSelectedUsers = [...props.selectedUsers]

  if (isAllSelected.value) {
    props.users.forEach((user) => {
      const index = newSelectedUsers.indexOf(user.id)
      if (index > -1) {
        newSelectedUsers.splice(index, 1)
      }
    })
  } else {
    props.users.forEach((user) => {
      if (!newSelectedUsers.includes(user.id)) {
        newSelectedUsers.push(user.id)
      }
    })
  }
  emit('update:selectedUsers', newSelectedUsers)
}

const startEdit = (user: User) => {
  editingUserId.value = user.id
}

const cancelEdit = () => {
  editingUserId.value = null
}

const saveEdit = async (userId: number) => {
  if (props.isSaving) return

  emit('update:isSaving', true)
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newUsers = [...props.allUsers]
    const userIndex = newUsers.findIndex((u) => u.id === userId)
    const existingUser = newUsers[userIndex]
    if (existingUser) {
      newUsers[userIndex] = {
        id: existingUser.id,
        name: localEditForm.value.name,
        email: localEditForm.value.email,
        role: localEditForm.value.role,
        avatar: existingUser.avatar,
        registrationDate: existingUser.registrationDate,
        lastActivity: existingUser.lastActivity,
        loginCount: existingUser.loginCount,
        postsCount: existingUser.postsCount,
        commentsCount: existingUser.commentsCount,
        status: existingUser.status,
      }
    }

    emit('update:users', newUsers)
  } catch (err) {
    alert('Ошибка сохранения: ' + (err as Error).message)
  } finally {
    emit('update:isSaving', false)
  }
}

const deleteUser = async (userId: number) => {
  if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
    return
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newUsers = props.allUsers.filter((u) => u.id !== userId)
    emit('update:users', newUsers)

    const newSelectedUsers = props.selectedUsers.filter((id) => id !== userId)
    emit('update:selectedUsers', newSelectedUsers)
  } catch (err) {
    alert('Ошибка удаления: ' + (err as Error).message)
  }
}

const toggleUserStatus = async (userId: number) => {
  try {
    const newUsers = [...props.allUsers]
    const user = newUsers.find((u) => u.id === userId)
    if (user) {
      user.status = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE
      emit('update:users', newUsers)
    }
  } catch (err) {
    alert('Ошибка изменения статуса: ' + (err as Error).message)
  }
}

const clearAllFilters = () => {
  emit('clearAllFilters')
}

const getActivityClass = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)

  if (diffDays < 1) return 'activity-recent'
  if (diffDays < 7) return 'activity-week'
  if (diffDays < 30) return 'activity-month'
  return 'activity-old'
}
</script>
