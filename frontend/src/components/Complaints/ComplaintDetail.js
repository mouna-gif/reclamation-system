// src/components/Complaints/ComplaintDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { complaintsApi } from '../../services/api';
import SLAIndicator from '../SLA/SLAIndicator';
import ComplaintStatus from './ComplaintStatus';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const data = await complaintsApi.getById(id);
        setComplaint(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement de la réclamation:', err);
        setError('Impossible de charger les détails de la réclamation. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      // Utiliser l'ID du technicien connecté (à adapter selon votre système d'authentification)
      const technicianId = 'current-user-id';
      const updatedComplaint = await complaintsApi.updateStatus(id, newStatus, technicianId);
      setComplaint(updatedComplaint);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      alert('Impossible de mettre à jour le statut. Veuillez réessayer.');
    }
  };

  if (loading) {
    return <div className="loading">Chargement des détails...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!complaint) {
    return <div className="not-found">Réclamation non trouvée.</div>;
  }

  return (
    <div className="complaint-detail-container">
      <div className="complaint-header">
        <button onClick={() => navigate(-1)} className="btn btn-back">
          &larr; Retour
        </button>
        <h2>Réclamation #{complaint._id.substring(0, 8)}</h2>
        <div className="complaint-actions">
          <ComplaintStatus
            currentStatus={complaint.status}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      <div className="complaint-meta">
        <div className="meta-item">
          <span className="meta-label">Catégorie:</span>
          <span className="meta-value">{complaint.category}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Produit/Service:</span>
          <span className="meta-value">{complaint.product}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Date de création:</span>
          <span className="meta-value">
            {format(new Date(complaint.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">SLA:</span>
          <span className="meta-value">
            <SLAIndicator sla={complaint.sla} />
          </span>
        </div>
      </div>

      <div className="complaint-section">
        <h3>Description</h3>
        <p className="complaint-description">{complaint.description}</p>
      </div>

      <div className="complaint-section">
        <h3>Coordonnées du client</h3>
        <div className="user-contact">
          <div className="contact-item">
            <span className="contact-label">Email:</span>
            <span className="contact-value">{complaint.userContact.email}</span>
          </div>
          {complaint.userContact.phone && (
            <div className="contact-item">
              <span className="contact-label">Téléphone:</span>
              <span className="contact-value">{complaint.userContact.phone}</span>
            </div>
          )}
        </div>
      </div>

      {complaint.assignedTo && (
        <div className="complaint-section">
          <h3>Assigné à</h3>
          <div className="assigned-to">
            <div>{complaint.assignedTo.name}</div>
            <div>{complaint.assignedTo.email}</div>
            <div>{complaint.assignedTo.department}</div>
          </div>
        </div>
      )}

      <div className="complaint-section">
        <h3>Historique</h3>
        {complaint.history && complaint.history.length > 0 ? (
          <ul className="history-list">
            {complaint.history.map((event, index) => (
              <li key={index} className="history-item">
                <div className="history-date">
                  {format(new Date(event.date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </div>
                <div className="history-action">{event.action}</div>
                {event.technician && (
                  <div className="history-technician">par {event.technician}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun historique disponible.</p>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetail;
