import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { slaApi } from '../../services/api';

const SLASettings = () => {
  const [slaList, setSlaList] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ Nouveau state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSLA, setCurrentSLA] = useState(null);

  useEffect(() => {
    fetchSLAs();
  }, []);

  // ✅ Ton useEffect ajouté ici
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const slaData = await slaApi.getAll();
        if (slaData.length === 0) {
          setError('Aucun SLA configuré. Veuillez en créer un d\'abord.');
        } else {
          setCategories(slaData.map(sla => sla.category));
        }
      } catch (err) {
        setError('Erreur de chargement des catégories');
      }
    };
    fetchCategories();
  }, []);

  const fetchSLAs = async () => {
    try {
      setLoading(true);
      const data = await slaApi.getAll();
      setSlaList(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des SLAs:', err);
      setError('Impossible de charger les SLAs. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    category: '',
    durationHours: 24,
    escalationEmail: ''
  };

  const validationSchema = Yup.object({
    category: Yup.string()
      .required('La catégorie est obligatoire')
      .oneOf(['Technique', 'Service', 'Produit', 'Autre'], 'Catégorie invalide'),
    durationHours: Yup.number()
      .required('La durée est obligatoire')
      .min(1, 'La durée minimale est de 1 heure'),
    escalationEmail: Yup.string()
      .required('L\'email d\'escalade est obligatoire')
      .email('Format d\'email invalide')
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (isEditing && currentSLA) {
        await slaApi.update(currentSLA._id, values);
      } else {
        await slaApi.create(values);
      }

      resetForm();
      setIsEditing(false);
      setCurrentSLA(null);
      await fetchSLAs();
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du SLA:', err);
      setError(err.response?.data?.error || 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleEdit = (sla) => {
    setCurrentSLA(sla);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce SLA?')) {
      try {
        await slaApi.delete(id);
        await fetchSLAs();
      } catch (err) {
        console.error('Erreur lors de la suppression du SLA:', err);
        setError('Impossible de supprimer le SLA. Veuillez réessayer.');
      }
    }
  };

  return (
    <div className="sla-settings-container">
      <h2>Configuration des SLAs</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="sla-form-container">
        <h3>{isEditing ? 'Modifier SLA' : 'Ajouter un nouveau SLA'}</h3>

        <Formik
          initialValues={isEditing && currentSLA ? currentSLA : initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="sla-form">
              <div className="form-group">
                <label htmlFor="category">Catégorie</label>
                <Field as="select" id="category" name="category" className="form-control">
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="Technique">Technique</option>
                  <option value="Service">Service</option>
                  <option value="Produit">Produit</option>
                  <option value="Autre">Autre</option>
                </Field>
                <ErrorMessage name="category" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="durationHours">Durée de résolution (heures)</label>
                <Field type="number" id="durationHours" name="durationHours" className="form-control" min="1" />
                <ErrorMessage name="durationHours" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="escalationEmail">Email d'escalade</label>
                <Field type="email" id="escalationEmail" name="escalationEmail" className="form-control" />
                <ErrorMessage name="escalationEmail" component="div" className="error" />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentSLA(null);
                  }}
                  className="btn btn-secondary"
                >
                  Annuler
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="sla-list-container">
        <h3>SLAs configurés</h3>

        {loading ? (
          <div className="loading">Chargement des SLAs...</div>
        ) : slaList.length === 0 ? (
          <div className="no-results">Aucun SLA configuré.</div>
        ) : (
          <table className="sla-table">
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Délai (heures)</th>
                <th>Email d'escalade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slaList.map(sla => (
                <tr key={sla._id}>
                  <td>{sla.category}</td>
                  <td>{sla.durationHours}</td>
                  <td>{sla.escalationEmail}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleEdit(sla)}
                        className="btn btn-sm btn-edit"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(sla._id)}
                        className="btn btn-sm btn-delete"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SLASettings;
