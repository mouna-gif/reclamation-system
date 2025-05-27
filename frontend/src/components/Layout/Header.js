import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">
          <h1>CRM Réclamations</h1>
        </Link>
      </div>
      <div className="header-actions">
        <div className="user-menu">
          <span className="user-info">Bonjour, Utilisateur</span>
          <button className="btn btn-sm btn-logout">Déconnexion</button>
        </div>
      </div>
    </header>
  );
};

// Add this line to export the component as default
export default Header;
