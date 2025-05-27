import express from 'express'
import Complaint from '../models/Complaint.js'
import SLA from '../models/SLA.js'
import { sendNotification } from '../services/notificationService.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const slaPolicy = await SLA.findOne({ category: req.body.category })
    if (!slaPolicy) return res.status(400).json({ error: 'Catégorie invalide' })

    const dueDate = new Date()
    dueDate.setHours(dueDate.getHours() + slaPolicy.durationHours)

    const complaint = await Complaint.create({
      ...req.body,
      sla: { 
        dueDate,
        status: 'Dans les temps'
      }
    })

    await sendNotification(
      slaPolicy.escalationEmail,
      'Nouvelle réclamation assignée',
      `Référence: ${complaint._id}\nCatégorie: ${complaint.category}\nDate limite: ${dueDate.toLocaleString()}`
    )

    res.status(201).json(complaint)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('assignedTo', 'name email department')
    
    if (!complaint) return res.status(404).json({ error: 'Non trouvé' })
    
    res.json(complaint)
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.put('/:id/status', async (req, res) => {
  try {
    const updates = {
      status: req.body.status,
      $push: {
        history: {
          action: `Changement statut → ${req.body.status}`,
          technician: req.body.technicianId
        }
      }
    }
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
    
    res.json(complaint)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router