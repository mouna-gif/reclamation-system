import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: String, required: true },
  product: { type: String, required: true },
  status: { 
    type: String, 
    default: 'Nouveau',
    enum: ['Nouveau', 'En cours', 'Résolu', 'Fermé']
  },
  userContact: {
    email: {
      type: String,
      required: [true, 'L\'email est obligatoire'],
      match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    phone: String
  },
  sla: {
    dueDate: Date,
    status: String
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  history: [{
    action: String,
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

export default mongoose.model('Complaint', complaintSchema)