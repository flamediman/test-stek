<template>
  <TheModal :show-modal="showModal" title="Добавить нового пользователя" @close="handleClose">
    <div class="add-user-form">
      <div class="form-group">
        <label>Имя*</label>
        <input
          v-model="formData.name"
          type="text"
          :class="{ error: errors.name }"
          @blur="validateField('name')"
          @input="validateField('name')"
        />
        <span v-if="errors.name" class="error-text">
          {{ errors.name }}
        </span>
      </div>

      <div class="form-group">
        <label>Email*</label>
        <input
          v-model="formData.email"
          type="email"
          :class="{ error: errors.email }"
          @blur="validateField('email')"
          @input="validateField('email')"
        />
        <span v-if="errors.email" class="error-text">
          {{ errors.email }}
        </span>
      </div>

      <div class="form-group">
        <label>Роль*</label>
        <select v-model="formData.role">
          <option :value="UserRole.USER">Пользователь</option>
          <option :value="UserRole.MODERATOR">Модератор</option>
          <option :value="UserRole.ADMIN">Администратор</option>
        </select>
      </div>

      <div class="form-group">
        <label>
          <input v-model="formData.sendWelcomeEmail" type="checkbox" />
          Отправить приветственное письмо
        </label>
      </div>
    </div>

    <template #footer>
      <button @click="handleClose" class="btn btn-secondary">Отмена</button>
      <button @click="handleSubmit" class="btn btn-primary" :disabled="!isFormValid || isSaving">
        {{ isSaving ? 'Сохранение...' : 'Добавить' }}
      </button>
    </template>
  </TheModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import TheModal from './ui/TheModal.vue'
import { useValidation } from '@/composables/useValidation'
import { required, email, minLength, unique } from '@/utils/validators'
import { UserRole } from '@/types/user-table'

interface NewUserForm {
  name: string
  email: string
  role: UserRole
  sendWelcomeEmail: boolean
}

interface Props {
  showModal: boolean
  isSaving?: boolean
  existingEmails?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  isSaving: false,
  existingEmails: () => [],
})

const emit = defineEmits<{
  close: []
  submit: [user: NewUserForm]
}>()

const formData = reactive<NewUserForm>({
  name: '',
  email: '',
  role: UserRole.USER,
  sendWelcomeEmail: true,
})

const { errors, validateField, isFormValid, reset } = useValidation(formData, {
  name: [
    required('Имя обязательно для заполнения'),
    minLength(3, 'Имя должно содержать минимум 3 символа'),
  ],
  email: [
    required('Email обязателен для заполнения'),
    email('Некорректный формат email'),
    unique(props.existingEmails, 'Пользователь с таким email уже существует'),
  ],
})

const resetData = () => {
  reset()
  Object.assign(formData, {
    name: '',
    email: '',
    role: UserRole.USER,
    sendWelcomeEmail: true,
  })
}

const handleClose = () => {
  resetData()
  emit('close')
}

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', { ...formData })
  }
}

watch(
  () => props.showModal,
  (isOpen) => {
    if (isOpen) {
      resetData()
    }
  },
)
</script>
