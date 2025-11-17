import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationsStore = defineStore('notifications', () => {
  const toasts = ref([])

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function notify({ type = 'info', title = '', message = '', timeout = 4000 } = {}) {
    const id = Date.now() + Math.floor(Math.random() * 10000)
    toasts.value.push({ id, type, title, message })
    if (timeout > 0) {
      setTimeout(() => remove(id), timeout)
    }
    return id
  }

  function success(message, title = '') {
    return notify({ type: 'success', title, message })
  }

  function error(message, title = '') {
    return notify({ type: 'error', title, message, timeout: 6000 })
  }

  function info(message, title = '') {
    return notify({ type: 'info', title, message })
  }

  return {
    toasts,
    notify,
    success,
    error,
    info,
    remove
  }
})

export default useNotificationsStore
