import { reactive } from 'vue'

export const store = reactive({
  // Datos de proyectos
  projects: [
    {
      id: 1,
      name: 'PULP SAMPLING SYSTEM 1230-25 REV.1',
      client: 'Newmont Suriname LLC',
      startDate: '2025-08-15',
      endDate: '2026-07-14',
      status: 'inprogress',
      progress: 45,
      budget: 150000,
      spent: 75000,
      description: 'Sistema de muestreo de pulpa avanzado',
      team: [1, 2, 3],
      risks: [
        { id: 1, title: 'Retraso en suministros', probability: 'high', impact: 'high' },
        { id: 2, title: 'Disponibilidad de recursos', probability: 'medium', impact: 'medium' }
      ],
      tasks: [
        { id: 1, name: 'Revisión de Ingeniería Crítica', status: 'planned', dueDate: '2025-12-04' },
        { id: 2, name: 'Pruebas de Fabricación', status: 'inprogress', dueDate: '2025-11-20' }
      ]
    },
    {
      id: 2,
      name: 'Mejora Sistema Filtrado',
      client: 'Minera Los Pelambres',
      startDate: '2025-09-01',
      endDate: '2026-03-15',
      status: 'inprogress',
      progress: 60,
      budget: 120000,
      spent: 72000,
      description: 'Mejora en el sistema de filtrado',
      team: [2, 3],
      risks: [],
      tasks: []
    },
    {
      id: 3,
      name: 'Automatización Planta Secundaria',
      client: 'Codelco Andina',
      startDate: '2025-07-10',
      endDate: '2026-01-30',
      status: 'completed',
      progress: 100,
      budget: 200000,
      spent: 200000,
      description: 'Automatización completa de la planta secundaria',
      team: [1, 2],
      risks: [],
      tasks: []
    }
  ],

  // Datos de recursos humanos
  teamMembers: [
    {
      id: 1,
      name: 'Luis Sandoval',
      role: 'Project Manager',
      email: 'luis.sandoval@multotec.com',
      phone: '56973762183',
      availability: 'available'
    },
    {
      id: 2,
      name: 'Andrés Vallebella',
      role: 'Chief Engineering',
      email: 'andres.vallebella@multotec.com',
      phone: '56227453317',
      availability: 'available'
    },
    {
      id: 3,
      name: 'Leandro Flores',
      role: 'Electrical and Control Specialist',
      email: 'leandro.flores@multotec.com',
      phone: '56990874153',
      availability: 'assigned'
    }
  ],

  // Métodos para gestionar datos
  addProject(project) {
    project.id = Math.max(...this.projects.map(p => p.id), 0) + 1
    this.projects.push(project)
  },

  updateProject(id, updates) {
    const project = this.projects.find(p => p.id === id)
    if (project) {
      Object.assign(project, updates)
    }
  },

  deleteProject(id) {
    const index = this.projects.findIndex(p => p.id === id)
    if (index > -1) {
      this.projects.splice(index, 1)
    }
  },

  getProjectById(id) {
    return this.projects.find(p => p.id === id)
  },

  addTeamMember(member) {
    member.id = Math.max(...this.teamMembers.map(m => m.id), 0) + 1
    this.teamMembers.push(member)
  }
})
