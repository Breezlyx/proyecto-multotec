<template>
  <div class="tabs">
    <div 
      v-for="tab in tabs" 
      :key="tab.id"
      class="tab"
      :class="{ active: activeTab === tab.id }"
      @click="activeTab = tab.id"
    >
      {{ tab.label }}
    </div>
  </div>
  <div class="tab-content">
    <slot :tab="activeTab"></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  tabs: {
    type: Array,
    required: true
  }
})

const activeTab = ref(0)
</script>

<style scoped>
.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.tab.active {
  border-bottom-color: var(--primary, #00843d);
  color: var(--primary, #00843d);
  font-weight: 500;
}
</style>
