import type { ValidationRule } from '@/composables/useValidation'

export const required = (message?: string): ValidationRule<string> => ({
  validator: (value: string) => {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      return message || 'Поле обязательно для заполнения'
    }
    return true
  },
})

export const email = (message?: string): ValidationRule<string> => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return {
    validator: (value: string) => {
      if (!value) return true
      if (!emailRegex.test(value)) {
        return message || 'Некорректный формат email'
      }
      return true
    },
  }
}

export const minLength = (min: number, message?: string): ValidationRule<string> => ({
  validator: (value: string) => {
    if (!value) return true
    if (typeof value === 'string' && value.trim().length < min) {
      return message || `Минимальная длина: ${min} символов`
    }
    return true
  },
})

export const maxLength = (max: number, message?: string): ValidationRule<string> => ({
  validator: (value: string) => {
    if (!value) return true
    if (typeof value === 'string' && value.length > max) {
      return message || `Максимальная длина: ${max} символов`
    }
    return true
  },
})

export const length = (min: number, max: number, message?: string): ValidationRule<string> => ({
  validator: (value: string) => {
    if (!value) return true
    if (typeof value === 'string') {
      const len = value.trim().length
      if (len < min || len > max) {
        return message || `Длина должна быть от ${min} до ${max} символов`
      }
    }
    return true
  },
})

export const unique = (existingValues: string[], message?: string): ValidationRule<string> => ({
  validator: (value: string) => {
    if (!value) return true
    if (existingValues.includes(value)) {
      return message || 'Это значение уже используется'
    }
    return true
  },
})
