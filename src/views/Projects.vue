<template>
  <div class="page">
    <h2 class="page-title">Gestión de Proyectos</h2>
    
    <TabsComponent :tabs="tabs">
      <template #default="{ tab }">
        <!-- Tab: Lista de Proyectos -->
        <div v-if="tab === 0">
          <div class="form-group">
            <input 
              v-model="searchQuery"
              type="text" 
              class="form-control" 
              placeholder="Buscar proyectos..."
            >
          </div>
          
          <table v-if="filteredProjects.length > 0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cliente</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in filteredProjects" :key="project.id">
                <td>{{ project.name }}</td>
                <td>{{ project.client }}</td>
                <td>{{ formatDate(project.startDate) }}</td>
                <td>{{ formatDate(project.endDate) }}</td>
                <td><StatusBadge :status="project.status">{{ getStatusLabel(project.status) }}</StatusBadge></td>
                <td>
                  <button class="btn btn-primary">Editar</button>
                  <button class="btn btn-warning">Ver</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else style="color: #666; margin-top: 20px;">No hay proyectos que coincidan con la búsqueda</p>
          
          <div class="form-group" style="margin-top: 20px;">
            <button class="btn btn-success" @click="showNewProjectForm = true">Nuevo Proyecto</button>
          </div>
        </div>

        <!-- Tab: Nuevo Proyecto -->
        <div v-else-if="tab === 1">
          <div v-if="showNewProjectForm" class="form-container">
            <h3>Crear Nuevo Proyecto</h3>
            <div class="form-group">
              <label>Nombre del Proyecto</label>
              <input v-model="newProject.name" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>Cliente</label>
              <input v-model="newProject.client" type="text" class="form-control">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Fecha Inicio</label>
                <input v-model="newProject.startDate" type="date" class="form-control">
              </div>
              <div class="form-group">
                <label>Fecha Fin</label>
                <input v-model="newProject.endDate" type="date" class="form-control">
              </div>
            </div>
            <div class="form-group">
              <label>Presupuesto</label>
              <input v-model.number="newProject.budget" type="number" class="form-control">
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="newProject.description" class="form-control" rows="4"></textarea>
            </div>
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-success" @click="saveNewProject">Guardar</button>
              <button class="btn" style="background: #ccc; color: #333;" @click="showNewProjectForm = false">Cancelar</button>
            </div>
          </div>
          <p v-else style="color: #666;">Haz clic en "Nuevo Proyecto" para crear uno.</p>
        </div>

        <!-- Tab: Gantt Chart -->
        <div v-else-if="tab === 2">
          <div class="gantt-container">
            <h3>Carta Gantt de Proyectos</h3>
            <div v-for="project in projectsStore.projects" :key="project.id" class="gantt-timeline">
              <div class="gantt-task-name">{{ project.name }}</div>
              <div class="gantt-task-bar">
                <div 
                  class="gantt-progress" 
                  :style="{ width: project.progress + '%' }"
                  :title="`${project.progress}% completado`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </TabsComponent>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectsStore } from '../stores/projects'
import StatusBadge from '../components/common/StatusBadge.vue'
import TabsComponent from '../components/common/TabsComponent.vue'

const projectsStore = useProjectsStore()

const tabs = [
  { id: 0, label: 'Lista de Proyectos' },
  { id: 1, label: 'Nuevo Proyecto' },
  { id: 2, label: 'Carta Gantt' }
]

const searchQuery = ref('')
const showNewProjectForm = ref(false)
const newProject = ref({
  name: '',
  client: '',
  startDate: '',
  endDate: '',
  budget: 0,
  description: '',
  status: 'planned',
  progress: 0,
  spent: 0,
  team: []
})

const filteredProjects = computed(() => {
  return projectsStore.projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES')
}

const getStatusLabel = (status) => {
  const labels = {
    planned: 'Planificado',
    inprogress: 'En Progreso',
    completed: 'Completado',
    delayed: 'Retrasado'
  }
  return labels[status] || status
}

const saveNewProject = () => {
  if (newProject.value.name && newProject.value.client) {
    projectsStore.addProject({ ...newProject.value })
    newProject.value = {
      name: '',
      client: '',
      startDate: '',
      endDate: '',
      budget: 0,
      description: '',
      status: 'planned',
      progress: 0,
      spent: 0,
      team: []
    }
    showNewProjectForm.value = false
    alert('Proyecto creado exitosamente')
  } else {
    alert('Por favor completa los campos requeridos')
  }
}
</script>

<style scoped>
.page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.page-title {
  color: var(--primary);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--dark);
}

.form-control {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border 0.3s;
  font-family: inherit;
}

.form-control:focus {
  border-color: var(--secondary);
  outline: none;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.form-container h3 {
  color: var(--primary);
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
  margin-right: 5px;
}

.btn-primary:hover {
  background: var(--secondary);
}

.btn-success {
  background: var(--success);
  color: white;
}

.btn-success:hover {
  background: #219653;
}

.btn-warning {
  background: var(--warning);
  color: white;
}

.btn-warning:hover {
  background: #e67e22;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table th,
table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 0.9rem;
}

table th {
  background: #f8f9fa;
  color: var(--dark);
  font-weight: 600;
}

table tr:hover {
  background: #f8f9fa;
}

.gantt-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.gantt-timeline {
  display: grid;
  grid-template-columns: 200px 1fr;
  margin-bottom: 20px;
  gap: 15px;
}

.gantt-task-name {
  padding: 10px;
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gantt-task-bar {
  position: relative;
  height: 30px;
  background: #f0f0f0;
  border-radius: 4px;
}

.gantt-progress {
  height: 100%;
  background: var(--secondary);
  border-radius: 4px;
  transition: width 0.5s;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5px;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}
</style>
