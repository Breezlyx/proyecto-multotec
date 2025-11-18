<template>
  <div class="risks-container">
    <div class="header">
      <h1>Riesgos</h1>
      <button class="btn btn-primary" @click="showAddModal = true">+ Nuevo Riesgo</button>
    </div>

    <div class="stats">
      <div class="stat-card">
        <span class="label">Total Riesgos</span>
        <span class="value">{{ risksStore.totalRisks }}</span>
      </div>
      <div class="stat-card">
        <span class="label">Riesgos Activos</span>
        <span class="value" style="color: var(--danger)">{{ risksStore.activeRisks }}</span>
      </div>
      <div class="stat-card">
        <span class="label">Prioridad Alta</span>
        <span class="value" style="color: var(--warning)">{{ risksStore.highPriorityRisks }}</span>
      </div>
    </div>

    <div class="risks-grid">
      <div v-if="risksStore.loading" class="loading">Cargando riesgos...</div>
      <div v-else-if="risksStore.risks.length === 0" class="empty-state">
        <p>No hay riesgos registrados</p>
      </div>
      <div v-for="risk in risksStore.risks" :key="risk.id" class="risk-card" :class="risk.status">
        <div class="risk-header">
          <h3>{{ risk.title }}</h3>
          <div class="risk-badges">
            <span class="badge probability" :class="risk.probability">{{ risk.probability }}</span>
            <span class="badge impact" :class="risk.impact">{{ risk.impact }}</span>
            <span class="badge status" :class="risk.status">{{ risk.status }}</span>
          </div>
        </div>
        <p class="risk-description">{{ risk.description }}</p>
        <div class="risk-meta">
          <span><strong>Propietario:</strong> {{ risk.owner }}</span>
          <span><strong>Mitigación:</strong> {{ risk.mitigation }}</span>
        </div>
        <div class="risk-actions">
          <button class="btn btn-sm btn-secondary" @click="openEditRisk(risk)">Editar</button>
          <button class="btn btn-sm btn-danger" @click="deleteRiskConfirm(risk)">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar riesgo -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <h2>{{ editingRisk ? 'Editar Riesgo' : 'Nuevo Riesgo' }}</h2>
        <form @submit.prevent="saveRisk">
          <div class="form-group">
            <label>Título *</label>
            <input v-model="formData.title" type="text" required />
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="formData.description" rows="3"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Proyecto *</label>
              <select v-model="formData.projectId" required>
                <option value="">Seleccionar proyecto</option>
                <option v-for="p in projectsStore.projects" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Propietario</label>
              <input v-model="formData.owner" type="text" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Probabilidad</label>
              <select v-model="formData.probability">
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div class="form-group">
              <label>Impacto</label>
              <select v-model="formData.impact">
                <option value="low">Bajo</option>
                <option value="medium">Medio</option>
                <option value="high">Alto</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Estado</label>
              <select v-model="formData.status">
                <option value="active">Activo</option>
                <option value="monitoring">Monitoreo</option>
                <option value="mitigated">Mitigado</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Plan de Mitigación</label>
            <textarea v-model="formData.mitigation" rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="showAddModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary">{{ editingRisk ? 'Guardar Cambios' : 'Crear Riesgo' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectsStore } from '../stores/projects'
import { useRisksStore } from '../stores/risks'
import { useNotificationsStore } from '../stores/notifications'
import { useModalsStore } from '../stores/modals'

const projectsStore = useProjectsStore()
const risksStore = useRisksStore()
const notifications = useNotificationsStore()
const modals = useModalsStore()

const showAddModal = ref(false)
const editingRisk = ref(null)
const formData = ref({
  title: '',
  description: '',
  projectId: '',
  owner: '',
  probability: 'medium',
  impact: 'medium',
  status: 'active',
  mitigation: ''
})

onMounted(async () => {
  await risksStore.fetchRisks()
  await projectsStore.fetchProjects()
})

const openEditRisk = (risk) => {
  editingRisk.value = risk
  formData.value = {
    title: risk.title,
    description: risk.description,
    projectId: risk.projectId,
    owner: risk.owner,
    probability: risk.probability,
    impact: risk.impact,
    status: risk.status,
    mitigation: risk.mitigation
  }
  showAddModal.value = true
}

const saveRisk = async () => {
  try {
    if (editingRisk.value) {
      await risksStore.updateRisk(editingRisk.value.id, formData.value)
      notifications.success('Riesgo actualizado correctamente')
    } else {
      await risksStore.addRisk(formData.value)
      notifications.success('Riesgo creado correctamente')
    }
    showAddModal.value = false
    resetForm()
    await risksStore.fetchRisks()
  } catch (err) {
    notifications.error('Error al guardar el riesgo')
    console.error(err)
  }
}

const deleteRiskConfirm = (risk) => {
  modals.confirm(
    '¿Eliminar Riesgo?',
    `¿Estás seguro de que quieres eliminar "${risk.title}"?`,
    async () => {
      try {
        await risksStore.deleteRisk(risk.id)
        notifications.success('Riesgo eliminado correctamente')
        await risksStore.fetchRisks()
      } catch (err) {
        notifications.error('Error al eliminar el riesgo')
        console.error(err)
      }
    }
  )
}

const resetForm = () => {
  editingRisk.value = null
  formData.value = {
    title: '',
    description: '',
    projectId: '',
    owner: '',
    probability: 'medium',
    impact: 'medium',
    status: 'active',
    mitigation: ''
  }
}
</script>

<style scoped>
.risks-container {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  color: var(--text-primary);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, var(--primary)15, var(--secondary)15);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid var(--primary);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-card .label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.stat-card .value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary);
}

.risks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.risk-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid var(--warning);
  transition: all 0.3s ease;
}

.risk-card.active {
  border-left-color: var(--danger);
  background-color: var(--danger)05;
}

.risk-card.monitoring {
  border-left-color: var(--warning);
  background-color: var(--warning)05;
}

.risk-card.mitigated {
  border-left-color: var(--success);
  background-color: var(--success)05;
}

.risk-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.risk-header h3 {
  margin: 0;
  color: var(--text-primary);
  flex: 1;
}

.risk-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge.high {
  background-color: var(--danger)20;
  color: var(--danger);
}

.badge.medium {
  background-color: var(--warning)20;
  color: var(--warning);
}

.badge.low {
  background-color: var(--info)20;
  color: var(--info);
}

.badge.status {
  background-color: var(--primary)20;
  color: var(--primary);
}

.risk-description {
  color: var(--text-secondary);
  margin: 1rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.risk-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.risk-meta span {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.risk-meta strong {
  color: var(--text-primary);
}

.risk-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.loading,
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  color: #333333;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideInUp 0.3s ease;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #e0e0e0;
}

@keyframes slideInUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal h2 {
  margin-top: 0;
  color: var(--primary);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--primary);
  padding-bottom: 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333333;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: #ffffff;
  color: #333333;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 132, 61, 0.1);
  background: #ffffff;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .risks-grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
