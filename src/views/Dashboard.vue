<template>
  <div class="page">
    <h2 class="page-title">Dashboard</h2>
    
    <div class="dashboard-cards">
      <div class="dashboard-card">
        <h3>Proyectos Activos</h3>
        <div class="number">{{ activeProjects }}</div>
        <div class="description">En ejecución</div>
      </div>
      <div class="dashboard-card">
        <h3>Tareas Pendientes</h3>
        <div class="number">{{ pendingTasks }}</div>
        <div class="description">Por completar</div>
      </div>
      <div class="dashboard-card">
        <h3>Presupuesto Utilizado</h3>
        <div class="number">{{ budgetPercentage }}%</div>
        <div class="description">Del total asignado</div>
      </div>
      <div class="dashboard-card">
        <h3>Riesgos Identificados</h3>
        <div class="number">{{ totalRisks }}</div>
        <div class="description">Requieren atención</div>
      </div>
    </div>
    
    <div class="chart-container">
      <h3>Progreso de Proyectos</h3>
      <div class="chart-placeholder">
        Gráfico de Progreso de Proyectos
      </div>
    </div>
    
    <div class="chart-container">
      <h3>Distribución de Recursos</h3>
      <div class="chart-placeholder">
        Gráfico de Distribución de Recursos
      </div>
    </div>
    
    <div class="project-card">
      <h3>Próximos Vencimientos</h3>
      <table v-if="upcomingTasks.length > 0">
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Tarea</th>
            <th>Fecha Límite</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in upcomingTasks" :key="task.taskId">
            <td>{{ task.projectName }}</td>
            <td>{{ task.taskName }}</td>
            <td>{{ formatDate(task.dueDate) }}</td>
            <td><StatusBadge :status="task.status">{{ getStatusLabel(task.status) }}</StatusBadge></td>
          </tr>
        </tbody>
      </table>
      <p v-else style="color: #666;">No hay tareas próximas a vencer</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectsStore } from '../stores/projects'
import { useResourcesStore } from '../stores/resources'
import StatusBadge from '../components/common/StatusBadge.vue'

const projectsStore = useProjectsStore()
const resourcesStore = useResourcesStore()

const activeProjects = computed(() => projectsStore.activeProjects)

const pendingTasks = computed(() => {
  let count = 0
  projectsStore.projects.forEach(project => {
    count += project.tasks.filter(t => t.status !== 'completed').length
  })
  return count
})

const budgetPercentage = computed(() => {
  const totalBudget = projectsStore.projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projectsStore.projects.reduce((sum, p) => sum + p.spent, 0)
  return totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
})

const totalRisks = computed(() => {
  let count = 0
  projectsStore.projects.forEach(project => {
    count += project.risks.length
  })
  return count
})

const upcomingTasks = computed(() => {
  const tasks = []
  projectsStore.projects.forEach(project => {
    project.tasks.forEach(task => {
      tasks.push({
        projectName: project.name,
        taskName: task.name,
        dueDate: task.dueDate,
        status: task.status,
        taskId: `${project.id}-${task.id}`
      })
    })
  })
  return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
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

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.dashboard-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  text-align: center;
}

.dashboard-card h3 {
  color: var(--primary);
  margin-bottom: 10px;
}

.dashboard-card .number {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary);
  margin: 10px 0;
}

.dashboard-card .description {
  color: #666;
  font-size: 0.9rem;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

.chart-container h3 {
  color: var(--primary);
  margin-bottom: 15px;
}

.chart-placeholder {
  height: 300px;
  background: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.1rem;
}

.project-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border-left: 4px solid var(--primary);
}

.project-card h3 {
  color: var(--primary);
  margin-bottom: 15px;
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
</style>
