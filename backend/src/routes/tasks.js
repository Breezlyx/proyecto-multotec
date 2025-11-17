import express from 'express'
import { allAsync, getAsync, runAsync } from '../database/index.js'

const router = express.Router()

// GET: all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await allAsync('SELECT * FROM tasks ORDER BY created_at DESC')
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET: task by id
router.get('/:id', async (req, res) => {
  try {
    const task = await getAsync('SELECT * FROM tasks WHERE id = ?', [req.params.id])
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST: create task
router.post('/', async (req, res) => {
  try {
    const { project_id, name, status, due_date } = req.body
    if (!project_id || !name) return res.status(400).json({ error: 'project_id and name are required' })
    const result = await runAsync(
      `INSERT INTO tasks (project_id, name, status, due_date) VALUES (?, ?, ?, ?)`,
      [project_id, name, status || 'planned', due_date || null]
    )
    const newTask = await getAsync('SELECT * FROM tasks WHERE id = ?', [result.id])
    res.status(201).json(newTask)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT: update task
router.put('/:id', async (req, res) => {
  try {
    const { project_id, name, status, due_date } = req.body
    await runAsync(
      `UPDATE tasks SET project_id = ?, name = ?, status = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [project_id, name, status || 'planned', due_date || null, req.params.id]
    )
    const updated = await getAsync('SELECT * FROM tasks WHERE id = ?', [req.params.id])
    if (!updated) return res.status(404).json({ error: 'Task not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE: task
router.delete('/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM tasks WHERE id = ?', [req.params.id])
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
