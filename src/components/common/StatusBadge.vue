<template>
  <span class="status-badge" :class="`status-${status}`">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: 'planned'
  }
})
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-planned {
  background: #e3f2fd;
  color: #1976d2;
}

.status-inprogress {
  background: #fff8e1;
  color: #ff8f00;
}

.status-completed {
  background: #e8f5e9;
  color: #388e3c;
}

.status-delayed {
  background: #ffebee;
  color: #d32f2f;
}
</style>
