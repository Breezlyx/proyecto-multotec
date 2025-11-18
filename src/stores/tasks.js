import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { keysToCamel, keysToSnake } from '../utils/transform'
import { mockData } from './mockData'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
// Si no hay VITE_API_BASE_URL definido, usar mock data
let useMockData = !import.meta.env.VITE_API_BASE_URL
let localTasks = [...mockData.tasks] // Copia local para mock


export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const completedTasks = computed(() => tasks.value.filter(t => t.status === 'completed').length)
  const totalTasks = computed(() => tasks.value.length)
  const inProgressTasks = computed(() => tasks.value.filter(t => t.status === 'inprogress').length)
  const getTasksByProject = (projectId) => tasks.value.filter(t => t.projectId === projectId)

  // Actions
  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        tasks.value = localTasks.map(t => ({ ...t }))
      } else {
        const res = await axios.get(`${API_BASE}/tasks`)
        const raw = res.data.value || res.data || []
        tasks.value = raw.map(r => keysToCamel(r))
      }
    } catch (err) {
      error.value = err
      console.error('fetchTasks error', err)
      // Fallback a mock data si hay error
      useMockData = true
      tasks.value = localTasks.map(t => ({ ...t }))
    } finally {
      loading.value = false
    }
  }

  const addTask = async (task) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        const newId = Math.max(...localTasks.map(t => t.id), 0) + 1
        const newTask = { ...task, id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        localTasks.push(newTask)
        tasks.value.push({ ...newTask })
        return newTask
      } else {
        const payload = keysToSnake(task)
        const res = await axios.post(`${API_BASE}/tasks`, payload)
        const created = res.data
        await fetchTasks()
        return keysToCamel(created)
      }
    } catch (err) {
      error.value = err
      console.error('addTask error', err)
      useMockData = true
      const newId = Math.max(...localTasks.map(t => t.id), 0) + 1
      const newTask = { ...task, id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      localTasks.push(newTask)
      tasks.value.push({ ...newTask })
      return newTask
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        const idx = localTasks.findIndex(t => t.id === id)
        if (idx >= 0) {
          localTasks[idx] = { ...localTasks[idx], ...updates, updatedAt: new Date().toISOString() }
          const idx2 = tasks.value.findIndex(t => t.id === id)
          if (idx2 >= 0) {
            tasks.value[idx2] = { ...localTasks[idx] }
          }
        }
      } else {
        const payload = keysToSnake(updates)
        await axios.put(`${API_BASE}/tasks/${id}`, payload)
        await fetchTasks()
      }
    } catch (err) {
      error.value = err
      console.error('updateTask error', err)
      useMockData = true
      const idx = localTasks.findIndex(t => t.id === id)
      if (idx >= 0) {
        localTasks[idx] = { ...localTasks[idx], ...updates, updatedAt: new Date().toISOString() }
        const idx2 = tasks.value.findIndex(t => t.id === id)
        if (idx2 >= 0) {
          tasks.value[idx2] = { ...localTasks[idx] }
        }
      }
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        const idx = localTasks.findIndex(t => t.id === id)
        if (idx >= 0) {
          localTasks.splice(idx, 1)
        }
        tasks.value = tasks.value.filter(t => t.id !== id)
      } else {
        await axios.delete(`${API_BASE}/tasks/${id}`)
        await fetchTasks()
      }
    } catch (err) {
      error.value = err
      console.error('deleteTask error', err)
      useMockData = true
      const idx = localTasks.findIndex(t => t.id === id)
      if (idx >= 0) {
        localTasks.splice(idx, 1)
      }
      tasks.value = tasks.value.filter(t => t.id !== id)
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    loading,
    error,
    completedTasks,
    totalTasks,
    inProgressTasks,
    getTasksByProject,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask
  }
})
