import express from 'express'
import { allAsync, getAsync, runAsync } from '../database/index.js'

const router = express.Router()

// GET: Obtener todos los proyectos
router.get('/', async (req, res) => {
  try {
    const projects = await allAsync('SELECT * FROM projects ORDER BY created_at DESC')
    
    // Obtener tareas y riesgos para cada proyecto
    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const tasks = await allAsync('SELECT * FROM tasks WHERE project_id = ?', [project.id])
        const risks = await allAsync('SELECT * FROM risks WHERE project_id = ?', [project.id])
        const teamIds = await allAsync('SELECT resource_id FROM project_resources WHERE project_id = ?', [project.id])
        
        return {
          ...project,
          tasks: tasks || [],
          risks: risks || [],
          team: teamIds.map(t => t.resource_id) || []
        }
      })
    )
    
    res.json(projectsWithDetails)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET: Obtener un proyecto específico
router.get('/:id', async (req, res) => {
  try {
    const project = await getAsync('SELECT * FROM projects WHERE id = ?', [req.params.id])
    
    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' })
    }
    
    const tasks = await allAsync('SELECT * FROM tasks WHERE project_id = ?', [project.id])
    const risks = await allAsync('SELECT * FROM risks WHERE project_id = ?', [project.id])
    const teamIds = await allAsync('SELECT resource_id FROM project_resources WHERE project_id = ?', [project.id])
    
    res.json({
      ...project,
      tasks: tasks || [],
      risks: risks || [],
      team: teamIds.map(t => t.resource_id) || []
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST: Crear nuevo proyecto
router.post('/', async (req, res) => {
  try {
    // Accept both camelCase and snake_case from clients
    const name = req.body.name || req.body.name
    const client = req.body.client || req.body.client
    const description = req.body.description || req.body.description || ''
    const startDate = req.body.startDate ?? req.body.start_date ?? ''
    const endDate = req.body.endDate ?? req.body.end_date ?? ''
    const budget = req.body.budget ?? req.body.budget ?? 0
    const status = req.body.status ?? req.body.status ?? 'planned'
    const progress = req.body.progress ?? req.body.progress ?? 0
    const spent = req.body.spent ?? req.body.spent ?? 0

    if (!name || !client) {
      return res.status(400).json({ error: 'Nombre y cliente son requeridos' })
    }

    const result = await runAsync(
      `INSERT INTO projects (name, client, description, start_date, end_date, budget, status, progress, spent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, client, description || '', startDate || '', endDate || '', budget || 0, status || 'planned', progress || 0, spent || 0]
    )

    const newProject = await getAsync('SELECT * FROM projects WHERE id = ?', [result.id])

    res.status(201).json({
      ...newProject,
      tasks: [],
      risks: [],
      team: []
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT: Actualizar un proyecto
router.put('/:id', async (req, res) => {
  try {
    const name = req.body.name || req.body.name
    const client = req.body.client || req.body.client
    const description = req.body.description || req.body.description || ''
    const startDate = req.body.startDate ?? req.body.start_date ?? ''
    const endDate = req.body.endDate ?? req.body.end_date ?? ''
    const budget = req.body.budget ?? req.body.budget ?? 0
    const status = req.body.status ?? req.body.status ?? 'planned'
    const progress = req.body.progress ?? req.body.progress ?? 0
    const spent = req.body.spent ?? req.body.spent ?? 0

    await runAsync(
      `UPDATE projects 
       SET name = ?, client = ?, description = ?, start_date = ?, end_date = ?, budget = ?, status = ?, progress = ?, spent = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, client, description || '', startDate || '', endDate || '', budget || 0, status || 'planned', progress || 0, spent || 0, req.params.id]
    )
    
    const updatedProject = await getAsync('SELECT * FROM projects WHERE id = ?', [req.params.id])
    
    if (!updatedProject) {
      return res.status(404).json({ error: 'Proyecto no encontrado' })
    }
    
    res.json(updatedProject)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE: Eliminar un proyecto
router.delete('/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM projects WHERE id = ?', [req.params.id])
    res.json({ message: 'Proyecto eliminado exitosamente' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
