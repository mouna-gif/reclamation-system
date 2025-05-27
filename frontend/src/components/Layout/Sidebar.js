import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              end
            >
              <span className="nav-icon">📋</span>
              <span className="nav-text">Réclamations</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/complaints/new"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <span className="nav-icon">➕</span>
              <span className="nav-text">Nouvelle réclamation</span>
            </NavLink>
          </li>
          <li className="nav-section">
            <span className="section-title">Administration</span>
          </li>
          <li>
            <NavLink
              to="/settings/sla"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <span className="nav-icon">⏱️</span>
              <span className="nav-text">Gestion des SLAs</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
