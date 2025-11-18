<template>
  <div class="tasks-container">
    <div class="header">
      <h1>Tareas</h1>
      <button class="btn btn-primary" @click="showAddModal = true">+ Nueva Tarea</button>
    </div>

    <div class="stats">
      <div class="stat-card">
        <span class="label">Total Tareas</span>
        <span class="value">{{ tasksStore.totalTasks }}</span>
      </div>
      <div class="stat-card">
        <span class="label">Completadas</span>
        <span class="value" style="color: var(--success)">{{ tasksStore.completedTasks }}</span>
      </div>
      <div class="stat-card">
        <span class="label">En Progreso</span>
        <span class="value" style="color: var(--warning)">{{ tasksStore.inProgressTasks }}</span>
      </div>
    </div>

    <div class="tasks-grid">
      <div v-if="tasksStore.loading" class="loading">Cargando tareas...</div>
      <div v-else-if="tasksStore.tasks.length === 0" class="empty-state">
        <p>No hay tareas registradas</p>
      </div>
      <div v-for="task in tasksStore.tasks" :key="task.id" class="task-card" :class="task.status">
        <div class="task-header">
          <h3>{{ task.title }}</h3>
          <div class="task-badges">
            <span class="badge" :class="task.priority">{{ task.priority }}</span>
            <span class="badge status" :class="task.status">{{ task.status }}</span>
          </div>
        </div>
        <p class="task-description">{{ task.description }}</p>
        <div class="task-meta">
          <span><strong>Asignado a:</strong> {{ task.assignee }}</span>
          <span><strong>Vencimiento:</strong> {{ formatDate(task.dueDate) }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
        </div>
        <div class="progress-text">{{ task.progress }}% completado</div>
        <div class="task-actions">
          <button class="btn btn-sm btn-secondary" @click="openEditTask(task)">Editar</button>
          <button class="btn btn-sm btn-danger" @click="deleteTaskConfirm(task)">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar tarea -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <h2>{{ editingTask ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
        <form @submit.prevent="saveTask">
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
              <label>Asignado a</label>
              <input v-model="formData.assignee" type="text" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Prioridad</label>
              <select v-model="formData.priority">
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div class="form-group">
              <label>Estado</label>
              <select v-model="formData.status">
                <option value="planning">Planificación</option>
                <option value="inprogress">En Progreso</option>
                <option value="completed">Completada</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Progreso (%)</label>
              <input v-model.number="formData.progress" type="number" min="0" max="100" />
            </div>
            <div class="form-group">
              <label>Fecha de Vencimiento</label>
              <input v-model="formData.dueDate" type="date" />
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="showAddModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary">{{ editingTask ? 'Guardar Cambios' : 'Crear Tarea' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectsStore } from '../stores/projects'
import { useTasksStore } from '../stores/tasks'
import { useNotificationsStore } from '../stores/notifications'
import { useModalsStore } from '../stores/modals'

const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()
const notifications = useNotificationsStore()
const modals = useModalsStore()

const showAddModal = ref(false)
const editingTask = ref(null)
const formData = ref({
  title: '',
  description: '',
  projectId: '',
  assignee: '',
  priority: 'medium',
  status: 'planning',
  progress: 0,
  dueDate: ''
})

onMounted(async () => {
  await tasksStore.fetchTasks()
  await projectsStore.fetchProjects()
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES')
}

const openEditTask = (task) => {
  editingTask.value = task
  formData.value = {
    title: task.title,
    description: task.description,
    projectId: task.projectId,
    assignee: task.assignee,
    priority: task.priority,
    status: task.status,
    progress: task.progress,
    dueDate: task.dueDate
  }
  showAddModal.value = true
}

const saveTask = async () => {
  try {
    if (editingTask.value) {
      await tasksStore.updateTask(editingTask.value.id, formData.value)
      notifications.success('Tarea actualizada correctamente')
    } else {
      await tasksStore.addTask(formData.value)
      notifications.success('Tarea creada correctamente')
    }
    showAddModal.value = false
    resetForm()
    await tasksStore.fetchTasks()
  } catch (err) {
    notifications.error('Error al guardar la tarea')
    console.error(err)
  }
}

const deleteTaskConfirm = (task) => {
  modals.confirm(
    '¿Eliminar Tarea?',
    `¿Estás seguro de que quieres eliminar "${task.title}"?`,
    async () => {
      try {
        await tasksStore.deleteTask(task.id)
        notifications.success('Tarea eliminada correctamente')
        await tasksStore.fetchTasks()
      } catch (err) {
        notifications.error('Error al eliminar la tarea')
        console.error(err)
      }
    }
  )
}

const resetForm = () => {
  editingTask.value = null
  formData.value = {
    title: '',
    description: '',
    projectId: '',
    assignee: '',
    priority: 'medium',
    status: 'planning',
    progress: 0,
    dueDate: ''
  }
}
</script>

<style scoped>
.tasks-container {
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

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.task-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.task-card.completed {
  opacity: 0.7;
  background-color: var(--success)10;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.task-header h3 {
  margin: 0;
  color: var(--text-primary);
  flex: 1;
}

.task-badges {
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

.task-description {
  color: var(--text-secondary);
  margin: 1rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.task-meta span {
  display: flex;
  gap: 0.5rem;
}

.task-meta strong {
  color: var(--text-primary);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--border);
  border-radius: 4px;
  margin: 1rem 0 0.5rem 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
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
  .tasks-grid {
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
