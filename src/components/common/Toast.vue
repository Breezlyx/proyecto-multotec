<template>
  <div class="toast-wrapper">
    <div v-for="t in notifications.toasts" :key="t.id" :class="['toast', `toast-${t.type}` ]">
      <div class="toast-body">
        <strong v-if="t.title" class="toast-title">{{ t.title }}</strong>
        <div class="toast-message">{{ t.message }}</div>
      </div>
      <button class="toast-close" @click="notifications.remove(t.id)">&times;</button>
    </div>
  </div>
</template>

<script setup>
import { useNotificationsStore } from '../../stores/notifications'
const notifications = useNotificationsStore()
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
  min-width: 240px;
  max-width: 360px;
  padding: 12px 14px;
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  display: flex;
  align-items: flex-start;
}
.toast .toast-body { flex: 1 }
.toast-title { display: block; margin-bottom: 6px }
.toast-message { font-size: 0.95rem }
.toast-close {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.9);
  font-size: 18px;
  cursor: pointer;
  padding: 0 6px;
}
.toast-info { background: linear-gradient(90deg,#2d9cff,#1b7ed6) }
.toast-success { background: linear-gradient(90deg,#27ae60,#2ecc71) }
.toast-error { background: linear-gradient(90deg,#e74c3c,#c0392b) }
</style>
