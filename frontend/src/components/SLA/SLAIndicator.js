import React from 'react';
import { formatDistanceToNow, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';

const SLAIndicator = ({ sla }) => {
  if (!sla || !sla.dueDate) {
    return <span className="sla-na">Non applicable</span>;
  }

  const dueDate = new Date(sla.dueDate);
  const now = new Date();
  const isExpired = isPast(dueDate);
  const isAtRisk = !isExpired && (dueDate - now) < 24 * 3600 * 1000; // Moins de 24h

  let statusClass = 'sla-ok';
  if (isExpired) {
    statusClass = 'sla-expired';
  } else if (isAtRisk) {
    statusClass = 'sla-risk';
  }

  return (
    <div className={`sla-indicator ${statusClass}`}>
      <div className="sla-status">
        {isExpired ? 'Dépassé' : isAtRisk ? 'À risque' : 'Dans les temps'}
      </div>
      <div className="sla-time">
        {isExpired
          ? `Dépassé de ${formatDistanceToNow(dueDate, { locale: fr, addSuffix: false })}`
          : `Expire dans ${formatDistanceToNow(dueDate, { locale: fr, addSuffix: false })}`
        }
      </div>
      <div className="sla-date">
        Échéance: {dueDate.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
};

export default SLAIndicator;
