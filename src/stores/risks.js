import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { keysToCamel, keysToSnake } from '../utils/transform'
import { mockData } from './mockData'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
// Si no hay VITE_API_BASE_URL definido, usar mock data
let useMockData = !import.meta.env.VITE_API_BASE_URL
let localRisks = [...mockData.risks] // Copia local para mock


export const useRisksStore = defineStore('risks', () => {
  const risks = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const activeRisks = computed(() => risks.value.filter(r => r.status === 'active').length)
  const totalRisks = computed(() => risks.value.length)
  const highPriorityRisks = computed(() => risks.value.filter(r => r.probability === 'high' && r.impact === 'high').length)
  const getRisksByProject = (projectId) => risks.value.filter(r => r.projectId === projectId)

  // Actions
  const fetchRisks = async () => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        risks.value = localRisks.map(r => ({ ...r }))
      } else {
        const res = await axios.get(`${API_BASE}/risks`)
        const raw = res.data.value || res.data || []
        risks.value = raw.map(r => keysToCamel(r))
      }
    } catch (err) {
      error.value = err
      console.error('fetchRisks error', err)
      // Fallback a mock data si hay error
      useMockData = true
      risks.value = localRisks.map(r => ({ ...r }))
    } finally {
      loading.value = false
    }
  }

  const addRisk = async (risk) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        const newId = Math.max(...localRisks.map(r => r.id), 0) + 1
        const newRisk = { ...risk, id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        localRisks.push(newRisk)
        risks.value.push({ ...newRisk })
        return newRisk
      } else {
        const payload = keysToSnake(risk)
        const res = await axios.post(`${API_BASE}/risks`, payload)
        const created = res.data
        await fetchRisks()
        return keysToCamel(created)
      }
    } catch (err) {
      error.value = err
      console.error('addRisk error', err)
      useMockData = true
      const newId = Math.max(...localRisks.map(r => r.id), 0) + 1
      const newRisk = { ...risk, id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      localRisks.push(newRisk)
      risks.value.push({ ...newRisk })
      return newRisk
    } finally {
      loading.value = false
    }
  }

  const updateRisk = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        const idx = localRisks.findIndex(r => r.id === id)
        if (idx >= 0) {
          localRisks[idx] = { ...localRisks[idx], ...updates, updatedAt: new Date().toISOString() }
          const idx2 = risks.value.findIndex(r => r.id === id)
          if (idx2 >= 0) {
            risks.value[idx2] = { ...localRisks[idx] }
          }
        }
      } else {
        const payload = keysToSnake(updates)
        await axios.put(`${API_BASE}/risks/${id}`, payload)
        await fetchRisks()
      }
    } catch (err) {
      error.value = err
      console.error('updateRisk error', err)
      useMockData = true
      const idx = localRisks.findIndex(r => r.id === id)
      if (idx >= 0) {
        localRisks[idx] = { ...localRisks[idx], ...updates, updatedAt: new Date().toISOString() }
        const idx2 = risks.value.findIndex(r => r.id === id)
        if (idx2 >= 0) {
          risks.value[idx2] = { ...localRisks[idx] }
        }
      }
    } finally {
      loading.value = false
    }
  }

  const deleteRisk = async (id) => {
    loading.value = true
    error.value = null
    try {
      if (useMockData) {
        const idx = localRisks.findIndex(r => r.id === id)
        if (idx >= 0) {
          localRisks.splice(idx, 1)
        }
        risks.value = risks.value.filter(r => r.id !== id)
      } else {
        await axios.delete(`${API_BASE}/risks/${id}`)
        await fetchRisks()
      }
    } catch (err) {
      error.value = err
      console.error('deleteRisk error', err)
      useMockData = true
      const idx = localRisks.findIndex(r => r.id === id)
      if (idx >= 0) {
        localRisks.splice(idx, 1)
      }
      risks.value = risks.value.filter(r => r.id !== id)
    } finally {
      loading.value = false
    }
  }

  return {
    risks,
    loading,
    error,
    activeRisks,
    totalRisks,
    highPriorityRisks,
    getRisksByProject,
    fetchRisks,
    addRisk,
    updateRisk,
    deleteRisk
  }
})
