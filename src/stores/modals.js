import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalsStore = defineStore('modals', () => {
  const confirmDialog = ref(null)

  function confirm({ title = '¿Estás seguro?', message = '', confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm = () => {}, onCancel = () => {} } = {}) {
    confirmDialog.value = {
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      isOpen: true
    }
  }

  function closeConfirm() {
    if (confirmDialog.value) {
      confirmDialog.value.isOpen = false
      confirmDialog.value = null
    }
  }

  return {
    confirmDialog,
    confirm,
    closeConfirm
  }
})

export default useModalsStore
