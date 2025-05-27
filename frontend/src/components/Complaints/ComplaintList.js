// src/components/Complaints/ComplaintList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintsApi } from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import SLAIndicator from '../SLA/SLAIndicator';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    status: '',
    category: ''
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const data = await complaintsApi.getAll(filter);
        setComplaints(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des réclamations:', err);
        setError('Impossible de charger les réclamations. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="complaints-list-container">
      <div className="complaints-header">
        <h2>Liste des Réclamations</h2>
        <Link to="/complaints/new" className="btn btn-primary">
          Nouvelle Réclamation
        </Link>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="status">Statut</label>
          <select
            id="status"
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            className="filter-control"
          >
            <option value="">Tous les statuts</option>
            <option value="Nouveau">Nouveau</option>
            <option value="En cours">En cours</option>
            <option value="Résolu">Résolu</option>
            <option value="Fermé">Fermé</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
            className="filter-control"
          >
            <option value="">Toutes les catégories</option>
            <option value="Technique">Technique</option>
            <option value="Service">Service</option>
            <option value="Produit">Produit</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Chargement des réclamations...</div>
      ) : complaints.length === 0 ? (
        <div className="no-results">Aucune réclamation trouvée.</div>
      ) : (
        <div className="complaints-table-container">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Catégorie</th>
                <th>Produit/Service</th>
                <th>Statut</th>
                <th>Date création</th>
                <th>SLA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(complaint => (
                <tr key={complaint._id}>
                  <td>{complaint._id.substring(0, 8)}...</td>
                  <td>{complaint.category}</td>
                  <td>{complaint.product}</td>
                  <td>
                    <span className={`status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>
                    {format(new Date(complaint.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </td>
                  <td>
                    <SLAIndicator sla={complaint.sla} />
                  </td>
                  <td>
                    <Link to={`/complaints/${complaint._id}`} className="btn btn-sm btn-view">
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
