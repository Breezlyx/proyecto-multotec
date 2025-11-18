import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Projects from '../views/Projects.vue'
import Resources from '../views/Resources.vue'
import Tasks from '../views/Tasks.vue'
import Risks from '../views/Risks.vue'
import Reports from '../views/Reports.vue'
import Settings from '../views/Settings.vue'

const routes = [
  {
    path: '/',
    component: Dashboard,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/projects',
    component: Projects,
    meta: { title: 'Proyectos' }
  },
  {
    path: '/resources',
    component: Resources,
    meta: { title: 'Recursos' }
  },
  {
    path: '/tasks',
    component: Tasks,
    meta: { title: 'Tareas' }
  },
  {
    path: '/risks',
    component: Risks,
    meta: { title: 'Riesgos' }
  },
  {
    path: '/reports',
    component: Reports,
    meta: { title: 'Informes' }
  },
  {
    path: '/settings',
    component: Settings,
    meta: { title: 'Configuración' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
