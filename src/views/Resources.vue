<template>
  <div class="page">
    <h2 class="page-title">Gestión de Recursos</h2>
    
    <TabsComponent :tabs="tabs">
      <template #default="{ tab }">
        <!-- Tab: Equipo -->
        <div v-if="tab === 0">
          <div class="form-group">
            <input 
              v-model="searchTeam"
              type="text" 
              class="form-control" 
              placeholder="Buscar miembros del equipo..."
            >
          </div>
          
          <div v-for="member in filteredTeam" :key="member.id" class="resource-card">
            <div class="resource-avatar">{{ getInitials(member.name) }}</div>
            <div class="resource-info">
              <h3>{{ member.name }}</h3>
              <p>{{ member.role }}</p>
              <p>{{ member.email }} | {{ member.phone }}</p>
              <p>
                <StatusBadge :status="member.availability === 'available' ? 'completed' : 'inprogress'">
                  {{ member.availability === 'available' ? 'Disponible' : 'Asignado' }}
                </StatusBadge>
              </p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <button class="btn btn-primary" @click="openEditMember(member)">Editar</button>
              <button class="btn btn-danger" @click="deleteTeamMemberConfirm(member.id)">Eliminar</button>
            </div>
          </div>
          
          <div class="form-group" style="margin-top: 20px;">
            <button class="btn btn-success" @click="showAddMember = true">Agregar Miembro</button>
          </div>

          <div v-if="showAddMember" class="form-container">
            <h3>Agregar Miembro del Equipo</h3>
            <div class="form-group">
              <label>Nombre</label>
              <input v-model="newMember.name" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>Rol</label>
              <input v-model="newMember.role" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="newMember.email" type="email" class="form-control">
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input v-model="newMember.phone" type="tel" class="form-control">
            </div>
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-success" @click="addTeamMember">Guardar</button>
              <button class="btn" style="background: #ccc; color: #333;" @click="showAddMember = false">Cancelar</button>
            </div>
          </div>

          <!-- Modal: Editar Miembro -->
          <div v-if="showEditMember" class="form-overlay">
            <div class="form-container">
              <h3>Editar Miembro del Equipo</h3>
              <div class="form-group">
                <label>Nombre</label>
                <input v-model="editMember.name" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Rol</label>
                <input v-model="editMember.role" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="editMember.email" type="email" class="form-control">
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input v-model="editMember.phone" type="tel" class="form-control">
              </div>
              <div class="form-group">
                <label>Disponibilidad</label>
                <select v-model="editMember.availability" class="form-control">
                  <option value="available">Disponible</option>
                  <option value="assigned">Asignado</option>
                </select>
              </div>
              <div style="display: flex; gap: 10px;">
                <button class="btn btn-success" @click="saveEditMember">Guardar Cambios</button>
                <button class="btn" style="background: #ccc; color: #333;" @click="showEditMember = false">Cancelar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Equipos -->
        <div v-else-if="tab === 1">
          <p style="color: #666; margin-top: 20px;">Gestión de equipos y herramientas del proyecto. Esta sección permitiría registrar y hacer seguimiento a los equipos utilizados en los proyectos.</p>
        </div>

        <!-- Tab: Materiales -->
        <div v-else-if="tab === 2">
          <p style="color: #666; margin-top: 20px;">Control de materiales y suministros. Esta sección permitiría gestionar el inventario de materiales necesarios para la ejecución de proyectos.</p>
        </div>
      </template>
    </TabsComponent>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useResourcesStore } from '../stores/resources'
import { useNotificationsStore } from '../stores/notifications'
import { useModalsStore } from '../stores/modals'
import StatusBadge from '../components/common/StatusBadge.vue'
import TabsComponent from '../components/common/TabsComponent.vue'

const resourcesStore = useResourcesStore()
const notifications = useNotificationsStore()
const modals = useModalsStore()

const tabs = [
  { id: 0, label: 'Equipo' },
  { id: 1, label: 'Equipos' },
  { id: 2, label: 'Materiales' }
]

const searchTeam = ref('')
const showAddMember = ref(false)
const showEditMember = ref(false)
const editingMemberId = ref(null)
const newMember = ref({
  name: '',
  role: '',
  email: '',
  phone: '',
  availability: 'available'
})
const editMember = ref({
  name: '',
  role: '',
  email: '',
  phone: '',
  availability: 'available'
})

const filteredTeam = computed(() => {
  return resourcesStore.teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTeam.value.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTeam.value.toLowerCase())
  )
})

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const addTeamMember = () => {
  if (newMember.value.name && newMember.value.role) {
    resourcesStore.addTeamMember({ ...newMember.value })
    newMember.value = {
      name: '',
      role: '',
      email: '',
      phone: '',
      availability: 'available'
    }
    showAddMember.value = false
    notifications.success('Miembro agregado exitosamente')
  } else {
    notifications.error('Por favor completa los campos requeridos')
  }
}

const openEditMember = (member) => {
  editingMemberId.value = member.id
  editMember.value = { ...member }
  showEditMember.value = true
}

const saveEditMember = () => {
  if (editMember.value.name && editMember.value.role) {
    resourcesStore.updateTeamMember(editingMemberId.value, editMember.value)
    showEditMember.value = false
    editingMemberId.value = null
    notifications.success('Miembro actualizado exitosamente')
  } else {
    notifications.error('Por favor completa los campos requeridos')
  }
}

const deleteTeamMemberConfirm = (memberId) => {
  modals.confirm({
    title: 'Eliminar Miembro',
    message: '¿Estás seguro de que deseas eliminar este miembro del equipo? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    onConfirm: () => {
      resourcesStore.deleteTeamMember(memberId)
      notifications.success('Miembro eliminado exitosamente')
    }
  })
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

.form-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-top: 20px;
}

.form-container h3 {
  color: var(--primary);
  margin-bottom: 20px;
}

.resource-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
}

.resource-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  margin-right: 15px;
  flex-shrink: 0;
}

.resource-info {
  flex: 1;
}

.resource-info h3 {
  color: var(--primary);
  margin-bottom: 5px;
}

.resource-info p {
  color: #666;
  margin-bottom: 5px;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.form-overlay {
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

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.btn-success {
  background: var(--success);
  color: white;
}

.btn-success:hover {
  background: #219653;
}
</style>
