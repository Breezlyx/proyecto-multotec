<template>
  <div class="page">
    <h2 class="page-title">Informes y Reportes</h2>
    
    <div class="report-card">
      <h3>Reporte de Progreso Mensual</h3>
      <p>Resumen del avance de todos los proyectos durante el mes actual, incluyendo métricas de desempeño, hitos alcanzados y desviaciones.</p>
      <button class="btn btn-primary" @click="generateReport('monthly')">Generar Reporte</button>
    </div>
    
    <div class="report-card">
      <h3>Reporte de Riesgos</h3>
      <p>Análisis de riesgos identificados en los proyectos activos, con evaluación de probabilidad e impacto, y planes de mitigación.</p>
      <button class="btn btn-primary" @click="generateReport('risks')">Generar Reporte</button>
    </div>
    
    <div class="report-card">
      <h3>Reporte Financiero</h3>
      <p>Estado de los presupuestos de proyectos, comparación entre lo planificado y lo ejecutado, y proyecciones de costos.</p>
      <button class="btn btn-primary" @click="generateReport('financial')">Generar Reporte</button>
    </div>
    
    <div class="report-card">
      <h3>Reporte de Recursos</h3>
      <p>Análisis de utilización de recursos humanos y materiales, identificación de sobrecargas y disponibilidad.</p>
      <button class="btn btn-primary" @click="generateReport('resources')">Generar Reporte</button>
    </div>
    
    <div class="chart-container" style="margin-top: 30px;">
      <h3>Reportes Personalizados</h3>
      <div class="form-group">
        <label>Seleccionar Tipo de Reporte</label>
        <select v-model="customReportType" class="form-control">
          <option value="">Selecciona un tipo...</option>
          <option value="progress">Progreso de Proyectos</option>
          <option value="tasks">Estado de Tareas</option>
          <option value="resources">Utilización de Recursos</option>
          <option value="risks">Análisis de Riesgos</option>
          <option value="budget">Desempeño Financiero</option>
        </select>
      </div>
      <div class="form-group">
        <label>Rango de Fechas</label>
        <div class="form-row">
          <input v-model="reportStartDate" type="date" class="form-control" placeholder="Fecha inicio">
          <input v-model="reportEndDate" type="date" class="form-control" placeholder="Fecha fin">
        </div>
      </div>
      <button class="btn btn-success" @click="generateCustomReport">Generar Reporte Personalizado</button>
    </div>

    <!-- Preview del reporte generado -->
    <div v-if="reportPreview" class="report-preview">
      <h3>Preview del Reporte: {{ reportPreview.title }}</h3>
      <div class="preview-content">
        <p>{{ reportPreview.content }}</p>
      </div>
      <button class="btn btn-primary" @click="downloadReport">Descargar PDF</button>
      <button class="btn" style="background: #ccc; color: #333; margin-left: 10px;" @click="reportPreview = null">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectsStore } from '../stores/projects'
import { useResourcesStore } from '../stores/resources'
import { useNotificationsStore } from '../stores/notifications'

const projectsStore = useProjectsStore()
const resourcesStore = useResourcesStore()
const notifications = useNotificationsStore()

const customReportType = ref('')
const reportStartDate = ref('')
const reportEndDate = ref('')
const reportPreview = ref(null)

const generateReport = (type) => {
  const reports = {
    monthly: {
      title: 'Reporte de Progreso Mensual',
      content: generateMonthlyReport()
    },
    risks: {
      title: 'Reporte de Riesgos',
      content: generateRisksReport()
    },
    financial: {
      title: 'Reporte Financiero',
      content: generateFinancialReport()
    },
    resources: {
      title: 'Reporte de Recursos',
      content: generateResourcesReport()
    }
  }
  
  reportPreview.value = reports[type]
}

const generateMonthlyReport = () => {
  let content = `Período: ${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}\n\n`
  content += `Total de Proyectos: ${projectsStore.projects.length}\n`
  content += `Proyectos Activos: ${projectsStore.activeProjects}\n`
  content += `Proyectos Completados: ${projectsStore.completedProjects}\n\n`
  
  content += 'Detalles por Proyecto:\n'
  projectsStore.projects.forEach(project => {
    content += `\n- ${project.name}\n  Estado: ${project.status}\n  Progreso: ${project.progress}%\n`
  })
  
  return content
}

const generateRisksReport = () => {
  let content = 'ANÁLISIS DE RIESGOS\n\n'
  
  let totalRisks = 0
  projectsStore.projects.forEach(project => {
    const risks = project.risks || []
    if (risks.length > 0) {
      content += `Proyecto: ${project.name}\n`
      risks.forEach(risk => {
        content += `  - ${risk.title} (Prob: ${risk.probability}, Impacto: ${risk.impact})\n`
        totalRisks++
      })
    }
  })
  
  content += `\nTotal de Riesgos Identificados: ${totalRisks}\n`
  return content
}

const generateFinancialReport = () => {
  let content = 'REPORTE FINANCIERO\n\n'
  
  const totalBudget = projectsStore.projects.reduce((sum, p) => sum + (Number(p?.budget) || 0), 0)
  const totalSpent = projectsStore.projects.reduce((sum, p) => sum + (Number(p?.spent) || 0), 0)
  const percentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
  
  content += `Presupuesto Total: $${totalBudget.toLocaleString()}\n`
  content += `Cantidad Gastada: $${totalSpent.toLocaleString()}\n`
  content += `Porcentaje Utilizado: ${percentage}%\n`
  content += `Presupuesto Restante: $${(totalBudget - totalSpent).toLocaleString()}\n\n`
  
  content += 'Por Proyecto:\n'
  projectsStore.projects.forEach(project => {
    const budget = Number(project.budget) || 0
    const spent = Number(project.spent) || 0
    const used = budget > 0 ? Math.round((spent / budget) * 100) : 0
    content += `\n- ${project.name}\n  Presupuesto: $${budget}\n  Gastado: $${spent} (${used}%)\n`
  })
  
  return content
}

const generateResourcesReport = () => {
  let content = 'REPORTE DE RECURSOS\n\n'
  
  content += `Total de Miembros del Equipo: ${resourcesStore.totalMembers}\n`
  content += `Disponibles: ${resourcesStore.availableMembers}\n`
  content += `Asignados: ${resourcesStore.assignedMembers}\n\n`
  
  content += 'Detalle del Equipo:\n'
  resourcesStore.teamMembers.forEach(member => {
    content += `\n- ${member.name} (${member.role})\n  Estado: ${member.availability === 'available' ? 'Disponible' : 'Asignado'}\n`
  })
  
  return content
}

const generateCustomReport = () => {
  if (!customReportType.value) {
    notifications.error('Por favor selecciona un tipo de reporte')
    return
  }
  
  const typeMap = {
    progress: 'monthly',
    tasks: 'monthly',
    resources: 'resources',
    risks: 'risks',
    budget: 'financial'
  }
  
  generateReport(typeMap[customReportType.value])
  if (reportStartDate.value || reportEndDate.value) {
    reportPreview.value.title += ` (${reportStartDate.value} a ${reportEndDate.value})`
  }
}

const downloadReport = () => {
  if (!reportPreview.value) return
  
  const element = document.createElement('a')
  const file = new Blob([reportPreview.value.content], {type: 'text/plain'})
  element.href = URL.createObjectURL(file)
  element.download = `${reportPreview.value.title}.txt`
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
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

.report-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.report-card h3 {
  color: var(--primary);
  margin-bottom: 10px;
}

.report-card p {
  color: #666;
  margin-bottom: 15px;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.chart-container h3 {
  color: var(--primary);
  margin-bottom: 15px;
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

.report-preview {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border-left: 4px solid var(--primary);
}

.report-preview h3 {
  color: var(--primary);
  margin-bottom: 15px;
}

.preview-content {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-family: monospace;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
  color: #333;
}
</style>
