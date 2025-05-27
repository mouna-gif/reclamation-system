const nodemailer = require('nodemailer');

// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Envoie une notification par email
 * @param {string} to - Adresse email du destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} text - Contenu de l'email en format texte
 * @returns {Promise} Résultat de l'envoi
 */
module.exports.sendNotification = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Support CRM" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      text,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
              <h3>Notification CRM</h3>
              <p>${text.replace(/\n/g, '<br>')}</p>
              <hr>
              <small>Cet email est généré automatiquement</small>
            </div>`
    });
    
    console.log(`Notification envoyée à ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Erreur d\'envoi:', error);
    throw new Error('Échec d\'envoi de notification');
  }
};

/**
 * Envoie une notification en masse à plusieurs destinataires
 * @param {Array<string>} recipients - Liste des adresses email
 * @param {string} subject - Sujet de l'email
 * @param {string} text - Contenu de l'email en format texte
 * @returns {Promise} Résultats de l'envoi
 */
module.exports.sendBulkNotification = async (recipients, subject, text) => {
  try {
    const promises = recipients.map(recipient => 
      this.sendNotification(recipient, subject, text)
    );
    
    return await Promise.all(promises);
  } catch (error) {
    console.error('Erreur d\'envoi en masse:', error);
    throw new Error('Échec d\'envoi de notifications en masse');
  }
};