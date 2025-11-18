<script setup>
import Header from './components/layout/Header.vue'
import Sidebar from './components/layout/Sidebar.vue'
import Footer from './components/layout/Footer.vue'
import Toast from './components/common/Toast.vue'
import ConfirmDialog from './components/common/ConfirmDialog.vue'
</script>

<template>
  <div id="app">
    <Header />
    <div class="container">
      <div class="main-content">
        <Sidebar />
        <main class="content">
          <RouterView />
        </main>
      </div>
    </div>
    <Footer />
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.main-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  margin-top: 20px;
}

.content {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  min-height: 500px;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}
</style>
