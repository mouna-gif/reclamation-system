import express from 'express'
import SLA from '../models/SLA.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const slas = await SLA.find()
    res.json(slas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const sla = await SLA.create(req.body)
    res.status(201).json(sla)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const sla = await SLA.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    res.json(sla)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await SLA.findByIdAndDelete(req.params.id)
    res.json({ message: 'SLA supprimé avec succès' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router