import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ComplaintList from './components/Complaints/ComplaintList';
import ComplaintForm from './components/Complaints/ComplaintForm';
import ComplaintDetail from './components/Complaints/ComplaintDetail';
import SLASettings from './components/SLA/SLASettings';
import './styles/main.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ComplaintList />} />
          <Route path="/complaints/new" element={<ComplaintForm />} />
          <Route path="/complaints/:id" element={<ComplaintDetail />} />
          <Route path="/settings/sla" element={<SLASettings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
