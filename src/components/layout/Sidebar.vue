<template>
  <aside class="sidebar">
    <h3>Áreas de Conocimiento PMBOK</h3>
    <ul>
      <li><a href="#" class="active">Integración</a></li>
      <li><a href="#">Alcance</a></li>
      <li><a href="#">Tiempo</a></li>
      <li><a href="#">Costos</a></li>
      <li><a href="#">Calidad</a></li>
      <li><a href="#">Recursos</a></li>
      <li><a href="#">Comunicaciones</a></li>
      <li><a href="#">Riesgos</a></li>
      <li><a href="#">Adquisiciones</a></li>
      <li><a href="#">Interesados</a></li>
    </ul>
    
    <h3>Procesos de Grupo</h3>
    <ul>
      <li><a href="#">Iniciación</a></li>
      <li><a href="#">Planificación</a></li>
      <li><a href="#">Ejecución</a></li>
      <li><a href="#">Monitoreo y Control</a></li>
      <li><a href="#">Cierre</a></li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  height: fit-content;
}

.sidebar h3 {
  color: var(--primary);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.sidebar ul {
  list-style: none;
}

.sidebar ul li {
  margin-bottom: 10px;
}

.sidebar ul li a {
  color: var(--dark);
  text-decoration: none;
  display: block;
  padding: 8px 10px;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.sidebar ul li a:hover,
.sidebar ul li a.active {
  background: var(--primary);
  color: white;
}
</style>
