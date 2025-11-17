<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <div class="logo-img-placeholder">M</div>
          <div class="logo-text">
            <h1>Multotec Project Management</h1>
            <p>Sistema de Gestión de Proyectos basado en PMBOK 6ª edición</p>
          </div>
        </div>
        <nav>
          <ul>
            <li>
              <RouterLink 
                to="/" 
                class="nav-link"
                :class="{ active: route.path === '/' }"
              >
                Dashboard
              </RouterLink>
            </li>
            <li>
              <RouterLink 
                to="/projects" 
                class="nav-link"
                :class="{ active: route.path === '/projects' }"
              >
                Proyectos
              </RouterLink>
            </li>
            <li>
              <RouterLink 
                to="/resources" 
                class="nav-link"
                :class="{ active: route.path === '/resources' }"
              >
                Recursos
              </RouterLink>
            </li>
            <li>
              <RouterLink 
                to="/reports" 
                class="nav-link"
                :class="{ active: route.path === '/reports' }"
              >
                Informes
              </RouterLink>
            </li>
            <li>
              <RouterLink 
                to="/settings" 
                class="nav-link"
                :class="{ active: route.path === '/settings' }"
              >
                Configuración
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
header {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img-placeholder {
  height: 50px;
  width: 50px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  margin-right: 10px;
}

.logo-text {
  margin-left: 0;
}

.logo-text h1 {
  font-size: 1.6rem;
  margin-bottom: 2px;
}

.logo-text p {
  font-size: 0.85rem;
  opacity: 0.9;
}

nav ul {
  display: flex;
  list-style: none;
}

nav ul li {
  margin-left: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255,255,255,0.2);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  nav ul {
    margin-top: 10px;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  nav ul li {
    margin: 5px;
  }
}
</style>
