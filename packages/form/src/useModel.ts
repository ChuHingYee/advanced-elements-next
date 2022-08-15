import { computed, inject } from 'vue'
import { advFormContextKey } from './tokens'
import type { AdvFormContext } from './tokens'
export default function useModel<T>(prop: string) {
  const advFormContext = inject<AdvFormContext>(advFormContextKey)
  const value = computed<T>({
    get() {
      if (advFormContext?.model) {
        return prop.split('/').reduce((source, key) => {
          return source ? source[key] : null
        }, advFormContext?.model.value)
      } else {
        return null
      }
    },
    set(val) {
      const _source = advFormContext?.model.value || {}
      const keys = prop.split('/')
      keys.reduce((source, key, index) => {
        if (index !== keys.length - 1) {
          return source ? source[key] : null
        } else {
          if (source) {
            source[key] = val
          }
          return source || null
        }
      }, _source)
      advFormContext?.updateModel(_source)
    },
  })
  return {
    value,
  }
}
