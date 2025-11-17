import { ref, computed } from 'vue'

export type ValidationRule<T = unknown, TData = unknown> = {
  validator: (value: T, data?: TData) => boolean | string
  message?: string
}

export type ValidationRules<T extends Record<string, unknown>> = {
  [K in keyof T]?: ValidationRule<T[K], T>[]
}

export function useValidation<T extends Record<string, unknown>>(
  data: T,
  rules: ValidationRules<T>,
) {
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const touched = ref<Partial<Record<keyof T, boolean>>>({})

  const validateField = (field: keyof T) => {
    const fieldRules = rules[field]
    if (!fieldRules) {
      errors.value[field] = undefined
      return true
    }

    const value = data[field]
    touched.value[field] = true

    for (const rule of fieldRules) {
      const result = rule.validator(value, data)
      if (result !== true) {
        errors.value[field] =
          typeof result === 'string' ? result : rule.message || 'Ошибка валидации'
        return false
      }
    }

    errors.value[field] = undefined
    return true
  }

  const validateAll = () => {
    let isValid = true
    for (const field in rules) {
      if (!validateField(field)) {
        isValid = false
      }
    }
    return isValid
  }

  const isFieldValid = (field: keyof T) => {
    return !errors.value[field] && (touched.value[field] || false)
  }

  const isFormValid = computed(() => {
    return Object.keys(rules).every((field) => {
      const fieldRules = rules[field as keyof T]
      if (!fieldRules) return true

      const value = data[field as keyof T]
      return fieldRules.every((rule) => {
        const result = rule.validator(value, data)
        return result === true
      })
    })
  })

  const reset = () => {
    errors.value = {}
    touched.value = {}
  }

  const resetField = (field: keyof T) => {
    errors.value[field] = undefined
    touched.value[field] = false
  }

  return {
    errors,
    touched,
    validateField,
    validateAll,
    isFieldValid,
    isFormValid,
    reset,
    resetField,
  }
}
