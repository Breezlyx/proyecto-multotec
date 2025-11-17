import express from 'express'
import { allAsync, getAsync, runAsync } from '../database/index.js'

const router = express.Router()

// GET all risks
router.get('/', async (req, res) => {
  try {
    const risks = await allAsync('SELECT * FROM risks ORDER BY created_at DESC')
    res.json(risks)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET risk by id
router.get('/:id', async (req, res) => {
  try {
    const risk = await getAsync('SELECT * FROM risks WHERE id = ?', [req.params.id])
    if (!risk) return res.status(404).json({ error: 'Risk not found' })
    res.json(risk)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create risk
router.post('/', async (req, res) => {
  try {
    const { project_id, title, probability, impact, description } = req.body
    if (!project_id || !title) return res.status(400).json({ error: 'project_id and title are required' })
    const result = await runAsync(
      `INSERT INTO risks (project_id, title, probability, impact, description) VALUES (?, ?, ?, ?, ?)`,
      [project_id, title, probability || '', impact || '', description || '']
    )
    const newRisk = await getAsync('SELECT * FROM risks WHERE id = ?', [result.id])
    res.status(201).json(newRisk)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update risk
router.put('/:id', async (req, res) => {
  try {
    const { project_id, title, probability, impact, description } = req.body
    await runAsync(
      `UPDATE risks SET project_id = ?, title = ?, probability = ?, impact = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [project_id, title, probability || '', impact || '', description || '', req.params.id]
    )
    const updated = await getAsync('SELECT * FROM risks WHERE id = ?', [req.params.id])
    if (!updated) return res.status(404).json({ error: 'Risk not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE risk
router.delete('/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM risks WHERE id = ?', [req.params.id])
    res.json({ message: 'Risk deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
