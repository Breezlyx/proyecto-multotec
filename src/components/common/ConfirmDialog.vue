<template>
  <div v-if="modals.confirmDialog?.isOpen" class="confirm-overlay">
    <div class="confirm-modal">
      <h3 class="confirm-title">{{ modals.confirmDialog.title }}</h3>
      <p v-if="modals.confirmDialog.message" class="confirm-message">
        {{ modals.confirmDialog.message }}
      </p>
      <div class="confirm-actions">
        <button 
          class="btn btn-secondary"
          @click="handleCancel"
        >
          {{ modals.confirmDialog.cancelText }}
        </button>
        <button 
          class="btn btn-danger"
          @click="handleConfirm"
        >
          {{ modals.confirmDialog.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModalsStore } from '../../stores/modals'

const modals = useModalsStore()

const handleConfirm = () => {
  if (modals.confirmDialog?.onConfirm) {
    modals.confirmDialog.onConfirm()
  }
  modals.closeConfirm()
}

const handleCancel = () => {
  if (modals.confirmDialog?.onCancel) {
    modals.confirmDialog.onCancel()
  }
  modals.closeConfirm()
}
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1099;
}

.confirm-modal {
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.confirm-title {
  color: var(--dark);
  font-size: 1.2rem;
  margin-bottom: 12px;
  font-weight: 600;
}

.confirm-message {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.btn-secondary {
  background: #ecf0f1;
  color: #333;
}

.btn-secondary:hover {
  background: #d5dbdb;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}
</style>
