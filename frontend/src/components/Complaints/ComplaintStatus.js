// src/components/Complaints/ComplaintStatus.js
import React, { useState } from 'react';

const ComplaintStatus = ({ currentStatus, onStatusChange }) => {
  const [isChanging, setIsChanging] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const statuses = ['Nouveau', 'En cours', 'Résolu', 'Fermé'];

  const handleChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStatusChange(selectedStatus);
    setIsChanging(false);
  };

  return (
    <div className="complaint-status">
      {!isChanging ? (
        <div className="status-display">
          <span className={`status-badge status-${currentStatus.toLowerCase().replace(' ', '-')}`}>
            {currentStatus}
          </span>
          <button
            onClick={() => setIsChanging(true)}
            className="btn btn-sm btn-edit-status"
          >
            Modifier
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="status-form">
          <select
            value={selectedStatus}
            onChange={handleChange}
            className="status-select"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div className="status-actions">
            <button type="submit" className="btn btn-sm btn-save">
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStatus(currentStatus);
                setIsChanging(false);
              }}
              className="btn btn-sm btn-cancel"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ComplaintStatus;
