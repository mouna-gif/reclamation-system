# README.md
```markdown
# Module Machine Learning pour le CRM Réclamations

Ce dossier contient l'implémentation ML pour :

1. **Prédiction de priorité** des réclamations (haute, moyenne, basse)
2. **Estimation du temps de résolution** d'une réclamation (en heures)

## Installation
```bash
cd ml
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Fichiers principaux
- `data_preparation.py` : chargement et préparation des données issues de la base MongoDB exportée.
- `model_utils.py` : fonctions pour sauvegarder/charger les modèles et pipelines.
- `train_priority_model.py` : script d'entraînement et sauvegarde du modèle de classification.
- `train_resolution_model.py` : script d'entraînement et sauvegarde du modèle de régression.
- `serve_model.py` : API Flask pour inférer en production.

## Usage
1. Préparer les données :
   ```bash
   python data_preparation.py --input data/export_complaints.json --output data/processed.csv
   ```
2. Entraîner les modèles :
   ```bash
   python train_priority_model.py
   python train_resolution_model.py
   ```
3. Lancer le service :
   ```bash
   python serve_model.py