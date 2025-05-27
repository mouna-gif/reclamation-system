import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import complaintRouter from './routes/complaints.js'
import slaRouter from './routes/sla.js'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Connexion MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`Connecté à MongoDB → db: ${mongoose.connection.db.databaseName}`)
  } catch (err) {
    console.error('Erreur de connexion MongoDB:', err)
    process.exit(1)
  }
}
connectDB()

// Routes
app.use('/api/complaints', complaintRouter)
app.use('/api/sla', slaRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Serveur démarré sur port ${PORT}`))