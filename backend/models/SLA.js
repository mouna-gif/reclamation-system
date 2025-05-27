const mongoose = require('mongoose');

const slaSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['Technique', 'Service', 'Produit', 'Autre']
  },
  durationHours: { 
    type: Number, 
    required: true,
    min: [1, 'La durée doit être au moins 1 heure']
  },
  escalationEmail: { 
    type: String, 
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  }
});

module.exports = mongoose.model('SLA', slaSchema);