<template>
  <div class="toast-wrapper">
    <div v-for="t in notifications.toasts" :key="t.id" :class="['toast', `toast-${t.type}` ]">
      <div class="toast-icon">
        <span v-if="t.type === 'success'" class="icon">✓</span>
        <span v-else-if="t.type === 'error'" class="icon">✕</span>
        <span v-else-if="t.type === 'info'" class="icon">ℹ</span>
      </div>
      <div class="toast-body">
        <strong class="toast-title">{{ getTitle(t.type, t.title) }}</strong>
        <div class="toast-message">{{ t.message }}</div>
      </div>
      <button class="toast-close" @click="notifications.remove(t.id)">&times;</button>
    </div>
  </div>
</template>

<script setup>
import { useNotificationsStore } from '../../stores/notifications'
const notifications = useNotificationsStore()

const getTitle = (type, customTitle) => {
  if (customTitle) return customTitle
  const titles = {
    success: '¡Éxito!',
    error: 'Error',
    info: 'Información'
  }
  return titles[type] || 'Notificación'
}
</script>

<style scoped>
.toast-wrapper {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.toast {
  min-width: 280px;
  max-width: 400px;
  padding: 14px 16px;
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: slideInRight 0.3s ease-out;
}
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(400px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.toast-icon {
  flex-shrink: 0;
  font-size: 1.4rem;
  font-weight: bold;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toast-body { 
  flex: 1;
  min-width: 0;
}
.toast-title { 
  display: block; 
  margin-bottom: 4px;
  font-size: 0.95rem;
}
.toast-message { 
  font-size: 0.9rem;
  opacity: 0.95;
  word-wrap: break-word;
}
.toast-close {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.8);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: opacity 0.2s;
}
.toast-close:hover {
  opacity: 1;
}
.toast-info { 
  background: linear-gradient(135deg,#3498db,#2980b9);
}
.toast-success { 
  background: linear-gradient(135deg,#27ae60,#229954);
}
.toast-error { 
  background: linear-gradient(135deg,#e74c3c,#c0392b);
}
</style>
