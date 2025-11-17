<template>
  <TheModal :show-modal="showModal" title="Информация о пользователе" @close="emit('close')">
    <div class="user-details">
      <div class="detail-section">
        <img
          :src="getUserAvatar(selectedUser.avatar, selectedUser.name)"
          :alt="selectedUser.name"
          class="avatar-large"
        />
        <h2>{{ selectedUser.name }}</h2>
        <p class="user-email">{{ selectedUser.email }}</p>
      </div>

      <div class="detail-section">
        <h4>Основная информация</h4>
        <div class="detail-row">
          <span class="label">ID:</span>
          <span>{{ selectedUser.id }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Роль:</span>
          <span :class="['role-badge', 'role-' + selectedUser.role]">
            {{ getRoleLabel(selectedUser.role) }}
          </span>
        </div>
        <div class="detail-row">
          <span class="label">Статус:</span>
          <span
            :class="[
              'status-badge',
              selectedUser.status === 'active' ? 'status-active' : 'status-inactive',
            ]"
          >
            {{ getUserStatusText(selectedUser.status) }}
          </span>
        </div>
        <div class="detail-row">
          <span class="label">Дата регистрации:</span>
          <span>{{ formatDate(selectedUser.registrationDate) }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Последняя активность:</span>
          <span>{{ formatRelativeTime(selectedUser.lastActivity) }}</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>Статистика</h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ selectedUser.loginCount || 0 }}</div>
            <div class="stat-label">Входов</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ selectedUser.postsCount || 0 }}</div>
            <div class="stat-label">Постов</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ selectedUser.commentsCount || 0 }}</div>
            <div class="stat-label">Комментариев</div>
          </div>
        </div>
      </div>
    </div>
  </TheModal>
</template>

<script setup lang="ts">
import type { User } from '@/types/user-table'
import TheModal from './ui/TheModal.vue'
import { formatRelativeTime, formatDate } from '@/utils/formatters'
import { getRoleLabel, getUserAvatar, getUserStatusText } from '@/utils/user'

interface Props {
  selectedUser: User
  showModal: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()
</script>
