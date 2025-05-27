// services/slaChecker.js
import cron from 'node-cron'
import Complaint from '../models/Complaint.js'
import { sendNotification } from './notificationService.js'

const checkSLA = async () => {
  try {
    const now = new Date()
    now.setHours(now.getHours() + 2) // Ajustement fuseau horaire

    const complaints = await Complaint.find({
      status: { $nin: ['Résolu', 'Fermé'] },
      'sla.dueDate': { $exists: true }
    }).populate('assignedTo')

    for (const complaint of complaints) {
      const dueDate = new Date(complaint.sla.dueDate)
      const timeLeft = dueDate - now

      let newStatus = 'Dans les temps'
      if (timeLeft < 0) newStatus = 'Dépassé'
      else if (timeLeft < 24 * 3600000) newStatus = 'À risque'

      if (newStatus !== complaint.sla.status) {
        complaint.sla.status = newStatus
        await complaint.save()

        if (complaint.assignedTo?.email) {
          await sendNotification(
            complaint.assignedTo.email,
            `Alerte SLA - ${complaint._id}`,
            `Statut: ${newStatus}\nDate limite: ${dueDate.toLocaleString('fr-FR')}\nLien: /complaints/${complaint._id}`
          )
        }
      }
    }
  } catch (error) {
    console.error('Erreur vérification SLA:', error)
  }
}

// Planification à 8h00 UTC+2
cron.schedule('0 6 * * *', checkSLA, {
  timezone: 'Europe/Paris'
})

export default checkSLA