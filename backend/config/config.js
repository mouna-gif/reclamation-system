module.exports = {
  // Configuration de base
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/reclamation_system',
  jwtSecret: process.env.JWT_SECRET || 'votreSecretJWT',
  
  // Configuration CORS pour le frontend
  corsOptions: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },

  // Configuration des SLA (Service Level Agreements)
  slaConfig: {
    'Technique': 24,    // 24 heures pour résolution
    'Facturation': 48,  // 48 heures
    'Service': 12,      // 12 heures
    'Général': 72       // 72 heures
  },

  // Paramètres de sécurité
  security: {
    bcryptSaltRounds: 10,
    jwtExpiresIn: '1h',
    refreshTokenExpiresIn: '7d'
  },

  // Paramètres d'application
  appSettings: {
    maxFileUploadSize: 5 * 1024 * 1024, // 5MB
    defaultPaginationLimit: 10
  }
};