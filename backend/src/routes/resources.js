import express from 'express'
import { allAsync, getAsync, runAsync } from '../database/index.js'

const router = express.Router()

// GET: Obtener todos los miembros del equipo
router.get('/', async (req, res) => {
  try {
    const teamMembers = await allAsync('SELECT * FROM team_members ORDER BY created_at DESC')
    res.json(teamMembers)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET: Obtener un miembro específico
router.get('/:id', async (req, res) => {
  try {
    const member = await getAsync('SELECT * FROM team_members WHERE id = ?', [req.params.id])
    
    if (!member) {
      return res.status(404).json({ error: 'Miembro no encontrado' })
    }
    
    res.json(member)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST: Agregar nuevo miembro
router.post('/', async (req, res) => {
  try {
    const { name, role, email, phone, availability } = req.body
    
    if (!name || !role) {
      return res.status(400).json({ error: 'Nombre y rol son requeridos' })
    }
    
    const result = await runAsync(
      `INSERT INTO team_members (name, role, email, phone, availability)
       VALUES (?, ?, ?, ?, ?)`,
      [name, role, email || '', phone || '', availability || 'available']
    )
    
    const newMember = await getAsync('SELECT * FROM team_members WHERE id = ?', [result.id])
    res.status(201).json(newMember)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT: Actualizar un miembro
router.put('/:id', async (req, res) => {
  try {
    const { name, role, email, phone, availability } = req.body
    
    await runAsync(
      `UPDATE team_members 
       SET name = ?, role = ?, email = ?, phone = ?, availability = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, role, email || '', phone || '', availability || 'available', req.params.id]
    )
    
    const updatedMember = await getAsync('SELECT * FROM team_members WHERE id = ?', [req.params.id])
    
    if (!updatedMember) {
      return res.status(404).json({ error: 'Miembro no encontrado' })
    }
    
    res.json(updatedMember)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE: Eliminar un miembro
router.delete('/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM team_members WHERE id = ?', [req.params.id])
    res.json({ message: 'Miembro eliminado exitosamente' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
