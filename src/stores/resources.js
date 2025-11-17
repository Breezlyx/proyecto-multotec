import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { keysToCamel, keysToSnake } from '../utils/transform'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

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
      const res = await axios.get(`${API_BASE}/resources`)
      const raw = res.data.value || res.data || []
      teamMembers.value = raw.map(r => keysToCamel(r))
    } catch (err) {
      error.value = err
      console.error('fetchTeamMembers error', err)
    } finally {
      loading.value = false
    }
  }

  const addTeamMember = async (member) => {
    loading.value = true
    error.value = null
    try {
      const payload = keysToSnake(member)
      const res = await axios.post(`${API_BASE}/resources`, payload)
      await fetchTeamMembers()
      return keysToCamel(res.data)
    } catch (err) {
      error.value = err
      console.error('addTeamMember error', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTeamMember = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const payload = keysToSnake(updates)
      const res = await axios.put(`${API_BASE}/resources/${id}`, payload)
      await fetchTeamMembers()
      return keysToCamel(res.data)
    } catch (err) {
      error.value = err
      console.error('updateTeamMember error', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTeamMember = async (id) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`${API_BASE}/resources/${id}`)
      await fetchTeamMembers()
      return true
    } catch (err) {
      error.value = err
      console.error('deleteTeamMember error', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const getTeamMemberById = async (id) => {
    const found = teamMembers.value.find(m => m.id === Number(id))
    if (found) return found
    try {
      const res = await axios.get(`${API_BASE}/resources/${id}`)
      return keysToCamel(res.data)
    } catch (err) {
      error.value = err
      console.error('getTeamMemberById error', err)
      return null
    }
  }

  // initialize
  fetchTeamMembers()

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
