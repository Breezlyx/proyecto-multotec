import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { keysToCamel, keysToSnake } from '../utils/transform'
import { mockData } from './mockData'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Usar mock data si no hay backend disponible (cuando VITE_API_BASE_URL no está definido)
let useMockData = !import.meta.env.VITE_API_BASE_URL
let localProjects = [...mockData.projects] // Copia local para mock


export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const activeProjects = computed(() => projects.value.filter(p => p.status === 'inprogress').length)
  const totalProjects = computed(() => projects.value.length)
  const completedProjects = computed(() => projects.value.filter(p => p.status === 'completed').length)

  // Actions
  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        // Usar mock data locales
        projects.value = localProjects
        return
      }
      const res = await axios.get(`${API_BASE}/projects`)
      const raw = res.data.value || res.data || []
      projects.value = raw.map(r => keysToCamel(r))
    } catch (err) {
      error.value = err
      console.error('fetchProjects error', err)
      // Si falla, usar mock data como fallback
      useMockData = true
      projects.value = localProjects
    } finally {
      loading.value = false
    }
  }

  const addProject = async (project) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        // Usar mock data - generar nuevo ID
        const newId = Math.max(...localProjects.map(p => p.id), 0) + 1
        const newProject = { id: newId, ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        localProjects.push(newProject)
        projects.value = [...localProjects]
        return newProject
      }
      const payload = keysToSnake(project)
      const res = await axios.post(`${API_BASE}/projects`, payload)
      await fetchProjects()
      return keysToCamel(res.data)
    } catch (err) {
      error.value = err
      console.error('addProject error', err)
      // Si falla, usar mock data como fallback
      useMockData = true
      const newId = Math.max(...localProjects.map(p => p.id), 0) + 1
      const newProject = { id: newId, ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      localProjects.push(newProject)
      projects.value = [...localProjects]
      return newProject
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        // Usar mock data - actualizar proyecto local
        const idx = localProjects.findIndex(p => p.id === id)
        if (idx !== -1) {
          localProjects[idx] = { ...localProjects[idx], ...updates, updatedAt: new Date().toISOString() }
          projects.value = [...localProjects]
          return localProjects[idx]
        }
        throw new Error('Project not found')
      }
      const payload = keysToSnake(updates)
      const res = await axios.put(`${API_BASE}/projects/${id}`, payload)
      await fetchProjects()
      return keysToCamel(res.data)
    } catch (err) {
      error.value = err
      console.error('updateProject error', err)
      // Si falla, usar mock data como fallback
      useMockData = true
      const idx = localProjects.findIndex(p => p.id === id)
      if (idx !== -1) {
        localProjects[idx] = { ...localProjects[idx], ...updates, updatedAt: new Date().toISOString() }
        projects.value = [...localProjects]
        return localProjects[idx]
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (id) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        // Usar mock data - eliminar proyecto local
        localProjects = localProjects.filter(p => p.id !== id)
        projects.value = [...localProjects]
        return true
      }
      await axios.delete(`${API_BASE}/projects/${id}`)
      await fetchProjects()
      return true
    } catch (err) {
      error.value = err
      console.error('deleteProject error', err)
      // Si falla, usar mock data como fallback
      useMockData = true
      localProjects = localProjects.filter(p => p.id !== id)
      projects.value = [...localProjects]
      return true
    } finally {
      loading.value = false
    }
  }

  const getProjectById = async (id) => {
    // try local cache first (tanto en mock como en real)
    const found = projects.value.find(p => p.id === Number(id))
    if (found) return found
    
    if (useMockData) {
      // Buscar en mock data local
      return localProjects.find(p => p.id === Number(id)) || null
    }
    
    try {
      const res = await axios.get(`${API_BASE}/projects/${id}`)
      return keysToCamel(res.data)
    } catch (err) {
      error.value = err
      console.error('getProjectById error', err)
      // Si falla, usar mock data como fallback
      useMockData = true
      return localProjects.find(p => p.id === Number(id)) || null
    }
  }

  // No hacer fetch automático - dejar que lo haga el componente en onMounted
  // para evitar rendering en blanco en la primera carga

  return {
    // State
    projects,
    loading,
    error,

    // Computed
    activeProjects,
    totalProjects,
    completedProjects,

    // Actions
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById
  }
})
