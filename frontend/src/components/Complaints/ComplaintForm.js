// src/components/Complaints/ComplaintForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { complaintsApi, slaApi } from '../../services/api';

const ComplaintForm = () => {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const slaData = await slaApi.getAll();
        setCategories(slaData.map(sla => sla.category));
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Impossible de charger les catégories. Veuillez réessayer plus tard.');
      }
    };

    fetchCategories();
  }, []);

  const initialValues = {
    description: '',
    category: '',
    product: '',
    userContact: {
      email: '',
      phone: ''
    }
  };

  const validationSchema = Yup.object({
    description: Yup.string()
      .required('La description est obligatoire')
      .min(10, 'La description doit contenir au moins 10 caractères'),
    category: Yup.string()
      .required('La catégorie est obligatoire'),
    product: Yup.string()
      .required('Le produit/service est obligatoire'),
    userContact: Yup.object({
      email: Yup.string()
        .email('Format d\'email invalide')
        .required('L\'email est obligatoire'),
      phone: Yup.string()
        .matches(/^\+?[0-9\s\-().]{7,15}$/, 'Numéro de téléphone invalide')
    })
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await complaintsApi.create(values);
      navigate(`/complaints/${result._id}`);
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError(err.response?.data?.error || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <h2>Nouvelle Réclamation</h2>

      {error && <div className="error-message">{error}</div>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid }) => (
          <Form className="complaint-form">
            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <Field as="select" id="category" name="category" className="form-control">
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="product">Produit/Service concerné</label>
              <Field type="text" id="product" name="product" className="form-control" />
              <ErrorMessage name="product" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description du problème</label>
              <Field as="textarea" id="description" name="description" className="form-control" rows="5" />
              <ErrorMessage name="description" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="userContact.email">Email</label>
              <Field type="email" id="userContact.email" name="userContact.email" className="form-control" />
              <ErrorMessage name="userContact.email" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="userContact.phone">Téléphone</label>
              <Field type="text" id="userContact.phone" name="userContact.phone" className="form-control" />
              <ErrorMessage name="userContact.phone" component="div" className="error" />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" disabled={isSubmitting || !isValid} className="btn btn-primary">
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre la réclamation'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ComplaintForm;
