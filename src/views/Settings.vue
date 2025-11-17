<template>
  <div class="page">
    <h2 class="page-title">Configuración del Sistema</h2>
    
    <div class="settings-section">
      <h3>Configuración de Usuario</h3>
      <div class="form-group">
        <label>Nombre de Usuario</label>
        <input v-model="userSettings.username" type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>Correo Electrónico</label>
        <input v-model="userSettings.email" type="email" class="form-control">
      </div>
      <div class="form-group">
        <label>Cambiar Contraseña</label>
        <input type="password" class="form-control" placeholder="Nueva contraseña">
      </div>
      <button class="btn btn-primary" @click="saveUserSettings">Guardar Cambios</button>
    </div>
    
    <div class="settings-section">
      <h3>Preferencias del Sistema</h3>
      <div class="form-group">
        <label>Idioma</label>
        <select v-model="systemPreferences.language" class="form-control">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>
      <div class="form-group">
        <label>Zona Horaria</label>
        <select v-model="systemPreferences.timezone" class="form-control">
          <option value="GMT-3">GMT-3:00 (Santiago)</option>
          <option value="GMT-4">GMT-4:00 (Caracas)</option>
          <option value="GMT-5">GMT-5:00 (Bogotá)</option>
          <option value="GMT+2">GMT+2:00 (Cairo)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Formato de Fecha</label>
        <select v-model="systemPreferences.dateFormat" class="form-control">
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="saveSystemPreferences">Guardar Preferencias</button>
    </div>
    
    <div class="settings-section">
      <h3>Configuración de Proyectos</h3>
      <div class="form-group">
        <label>Plantillas de Proyectos</label>
        <select v-model="projectSettings.template" class="form-control">
          <option value="standard">Proyecto Estándar PMBOK</option>
          <option value="agile">Proyecto Ágil</option>
          <option value="hybrid">Proyecto Híbrido</option>
        </select>
      </div>
      <div class="form-group">
        <label>Flujos de Aprobación</label>
        <select v-model="projectSettings.approvalFlow" class="form-control">
          <option value="simple">Aprobación Simple</option>
          <option value="two-level">Aprobación en Dos Niveles</option>
          <option value="complex">Aprobación Compleja</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="saveProjectSettings">Guardar Configuración</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotificationsStore } from '../stores/notifications'

const notifications = useNotificationsStore()

const userSettings = ref({
  username: 'admin',
  email: 'admin@multotec.com'
})

const systemPreferences = ref({
  language: 'es',
  timezone: 'GMT-3',
  dateFormat: 'DD/MM/YYYY'
})

const projectSettings = ref({
  template: 'standard',
  approvalFlow: 'simple'
})

const saveUserSettings = () => {
  notifications.success('Configuración de usuario guardada correctamente')
}

const saveSystemPreferences = () => {
  notifications.success('Preferencias del sistema guardadas correctamente')
}

const saveProjectSettings = () => {
  notifications.success('Configuración de proyectos guardada correctamente')
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

.settings-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.settings-section h3 {
  color: var(--primary);
  margin-bottom: 15px;
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
</style>
