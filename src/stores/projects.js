import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { keysToCamel, keysToSnake } from '../utils/transform'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

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
      const res = await axios.get(`${API_BASE}/projects`)
      const raw = res.data.value || res.data || []
      projects.value = raw.map(r => keysToCamel(r))
    } catch (err) {
      error.value = err
      console.error('fetchProjects error', err)
    } finally {
      loading.value = false
    }
  }

  const addProject = async (project) => {
    loading.value = true
    error.value = null
    try {
      const payload = keysToSnake(project)
      const res = await axios.post(`${API_BASE}/projects`, payload)
      const createdRaw = res.data
      await fetchProjects()
      return keysToCamel(createdRaw)
    } catch (err) {
      error.value = err
      console.error('addProject error', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const payload = keysToSnake(updates)
      const res = await axios.put(`${API_BASE}/projects/${id}`, payload)
      await fetchProjects()
      return keysToCamel(res.data)
    } catch (err) {
      error.value = err
      console.error('updateProject error', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (id) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`${API_BASE}/projects/${id}`)
      await fetchProjects()
      return true
    } catch (err) {
      error.value = err
      console.error('deleteProject error', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const getProjectById = async (id) => {
    // try local cache first
    const found = projects.value.find(p => p.id === Number(id))
    if (found) return found
    try {
      const res = await axios.get(`${API_BASE}/projects/${id}`)
      return keysToCamel(res.data)
    } catch (err) {
      error.value = err
      console.error('getProjectById error', err)
      return null
    }
  }

  // initialize by fetching
  fetchProjects()

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
