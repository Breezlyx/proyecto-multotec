import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { keysToCamel, keysToSnake } from '../utils/transform'
import { mockData } from './mockData'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Usar mock data si no hay backend disponible (cuando VITE_API_BASE_URL no está definido)
let useMockData = !import.meta.env.VITE_API_BASE_URL
let localMembers = [...mockData.resources] // Copia local para mock


export const useResourcesStore = defineStore('resources', () => {
  const teamMembers = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const totalMembers = computed(() => teamMembers.value.length)
  const availableMembers = computed(() => teamMembers.value.filter(m => m.availability === 'available').length)
  const assignedMembers = computed(() => teamMembers.value.filter(m => m.availability === 'assigned').length)

  // Actions
  const fetchTeamMembers = async () => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        // Usar mock data locales
        teamMembers.value = localMembers
        return
      }
      const res = await axios.get(`${API_BASE}/resources`)
      const raw = res.data.value || res.data || []
      teamMembers.value = raw.map(r => keysToCamel(r))
    } catch (err) {
      error.value = err
      console.error('fetchTeamMembers error', err)
      // Si falla, usar mock data como fallback
      useMockData = true
      teamMembers.value = localMembers
    } finally {
      loading.value = false
    }
  }

  const addTeamMember = async (member) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        // Usar mock data - generar nuevo ID
        const newId = Math.max(...localMembers.map(m => m.id), 0) + 1
        const newMember = { id: newId, ...member, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        localMembers.push(newMember)
        teamMembers.value = [...localMembers]
        return newMember
      }
      const payload = keysToSnake(member)
      const res = await axios.post(`${API_BASE}/resources`, payload)
      await fetchTeamMembers()
      return keysToCamel(res.data)
    } catch (err) {
      error.value = err
      console.error('addTeamMember error', err)
      // Si falla, usar mock data como fallback
      useMockData = true
      const newId = Math.max(...localMembers.map(m => m.id), 0) + 1
      const newMember = { id: newId, ...member, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      localMembers.push(newMember)
      teamMembers.value = [...localMembers]
      return newMember
    } finally {
      loading.value = false
    }
  }

  const updateTeamMember = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        // Usar mock data - actualizar miembro local
        const idx = localMembers.findIndex(m => m.id === id)
        if (idx !== -1) {
          localMembers[idx] = { ...localMembers[idx], ...updates, updatedAt: new Date().toISOString() }
          teamMembers.value = [...localMembers]
          return localMembers[idx]
        }
        throw new Error('Member not found')
      }
      const payload = keysToSnake(updates)
      const res = await axios.put(`${API_BASE}/resources/${id}`, payload)
      await fetchTeamMembers()
      return keysToCamel(res.data)
    } catch (err) {
      error.value = err
      console.error('updateTeamMember error', err)
      // Si falla, usar mock data como fallback
      useMockData = true
      const idx = localMembers.findIndex(m => m.id === id)
      if (idx !== -1) {
        localMembers[idx] = { ...localMembers[idx], ...updates, updatedAt: new Date().toISOString() }
        teamMembers.value = [...localMembers]
        return localMembers[idx]
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTeamMember = async (id) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        // Usar mock data - eliminar miembro local
        localMembers = localMembers.filter(m => m.id !== id)
        teamMembers.value = [...localMembers]
        return true
      }
      await axios.delete(`${API_BASE}/resources/${id}`)
      await fetchTeamMembers()
      return true
    } catch (err) {
      error.value = err
      console.error('deleteTeamMember error', err)
      // Si falla, usar mock data como fallback
      useMockData = true
      localMembers = localMembers.filter(m => m.id !== id)
      teamMembers.value = [...localMembers]
      return true
    } finally {
      loading.value = false
    }
  }

  const getTeamMemberById = async (id) => {
    const found = teamMembers.value.find(m => m.id === Number(id))
    if (found) return found
    
    if (useMockData) {
      // Buscar en mock data local
      return localMembers.find(m => m.id === Number(id)) || null
    }
    
    try {
      const res = await axios.get(`${API_BASE}/resources/${id}`)
      return keysToCamel(res.data)
    } catch (err) {
      error.value = err
      console.error('getTeamMemberById error', err)
      // Si falla, usar mock data como fallback
      useMockData = true
      return localMembers.find(m => m.id === Number(id)) || null
    }
  }

  // No hacer fetch automático - dejar que lo haga el componente en onMounted
  // para evitar rendering en blanco en la primera carga

  return {
    // State
    teamMembers,
    loading,
    error,

    // Computed
    totalMembers,
    availableMembers,
    assignedMembers,

    // Actions
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamMemberById
  }
})
