// Mock data para producción - se usa cuando no hay backend accesible
export const mockData = {
  projects: [
    {
      id: 1,
      name: 'Rediseño de Plataforma',
      description: 'Modernizar la interfaz de usuario y mejorar la experiencia',
      status: 'inprogress',
      startDate: '2025-01-15',
      endDate: '2025-04-30',
      budget: 50000,
      manager: 'Juan Pérez',
      progress: 65,
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    },
    {
      id: 2,
      name: 'Integración API REST',
      description: 'Conectar sistema con terceros mediante API REST',
      status: 'inprogress',
      startDate: '2025-02-01',
      endDate: '2025-05-15',
      budget: 35000,
      manager: 'María García',
      progress: 45,
      createdAt: '2025-02-01T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    },
    {
      id: 3,
      name: 'Migración Base de Datos',
      description: 'Migrar datos de BD antigua a nueva arquitectura',
      status: 'completed',
      startDate: '2024-11-01',
      endDate: '2025-01-31',
      budget: 28000,
      manager: 'Carlos López',
      progress: 100,
      createdAt: '2024-11-01T10:00:00Z',
      updatedAt: '2025-01-31T18:00:00Z'
    },
    {
      id: 4,
      name: 'Sistema de Reportes',
      description: 'Desarrollar dashboard de reportes analíticos',
      status: 'planning',
      startDate: '2025-03-01',
      endDate: '2025-06-30',
      budget: 42000,
      manager: 'Ana Martínez',
      progress: 15,
      createdAt: '2025-03-01T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    }
  ],
  resources: [
    {
      id: 1,
      name: 'Juan Pérez',
      role: 'Project Manager',
      email: 'juan.perez@multotec.com',
      department: 'Gestión',
      availability: 80,
      skills: ['Liderazgo', 'Gestión de Proyectos', 'Comunicación'],
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    },
    {
      id: 2,
      name: 'María García',
      role: 'Full Stack Developer',
      email: 'maria.garcia@multotec.com',
      department: 'Desarrollo',
      availability: 95,
      skills: ['Vue.js', 'Node.js', 'PostgreSQL', 'AWS'],
      createdAt: '2025-01-05T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    },
    {
      id: 3,
      name: 'Carlos López',
      role: 'DevOps Engineer',
      email: 'carlos.lopez@multotec.com',
      department: 'Infraestructura',
      availability: 70,
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      createdAt: '2025-01-10T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    },
    {
      id: 4,
      name: 'Ana Martínez',
      role: 'QA Engineer',
      email: 'ana.martinez@multotec.com',
      department: 'Calidad',
      availability: 85,
      skills: ['Testing Automatizado', 'Cypress', 'Manual QA'],
      createdAt: '2025-01-12T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    }
  ],
  tasks: [
    {
      id: 1,
      projectId: 1,
      title: 'Diseño de componentes UI',
      description: 'Crear sistema de diseño reutilizable',
      status: 'completed',
      priority: 'high',
      assignee: 'María García',
      dueDate: '2025-02-15',
      progress: 100,
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-02-15T18:00:00Z'
    },
    {
      id: 2,
      projectId: 1,
      title: 'Implementar autenticación',
      description: 'Sistema de login con JWT',
      status: 'inprogress',
      priority: 'high',
      assignee: 'Juan Pérez',
      dueDate: '2025-03-01',
      progress: 60,
      createdAt: '2025-02-01T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    },
    {
      id: 3,
      projectId: 2,
      title: 'Documentar endpoints API',
      description: 'Documentación Swagger de todos los endpoints',
      status: 'planning',
      priority: 'medium',
      assignee: 'Carlos López',
      dueDate: '2025-03-15',
      progress: 20,
      createdAt: '2025-02-10T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    },
    {
      id: 4,
      projectId: 1,
      title: 'Testing de componentes',
      description: 'Unit tests para componentes Vue',
      status: 'planning',
      priority: 'medium',
      assignee: 'Ana Martínez',
      dueDate: '2025-03-20',
      progress: 0,
      createdAt: '2025-02-15T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    }
  ],
  risks: [
    {
      id: 1,
      projectId: 1,
      title: 'Cambio de requerimientos',
      description: 'Cliente podría cambiar especificaciones a mitad del proyecto',
      probability: 'high',
      impact: 'high',
      status: 'monitoring',
      mitigation: 'Mantener comunicación semanal con stakeholders',
      owner: 'Juan Pérez',
      createdAt: '2025-01-25T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    },
    {
      id: 2,
      projectId: 1,
      title: 'Falta de recursos',
      description: 'Posible indisponibilidad de developers senior',
      probability: 'medium',
      impact: 'medium',
      status: 'active',
      mitigation: 'Contratar recursos externos como backup',
      owner: 'María García',
      createdAt: '2025-02-01T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    },
    {
      id: 3,
      projectId: 2,
      title: 'Compatibilidad de versiones',
      description: 'Conflictos con versiones de dependencias',
      probability: 'medium',
      impact: 'low',
      status: 'monitoring',
      mitigation: 'Testing exhaustivo en múltiples entornos',
      owner: 'Carlos López',
      createdAt: '2025-02-05T10:00:00Z',
      updatedAt: '2025-11-17T10:00:00Z'
    }
  ]
}
