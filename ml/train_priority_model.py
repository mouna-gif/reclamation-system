# train_priority_model.py

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from model_utils import save_model

# Charger les données prétraitées
df = pd.read_csv('data/processed.csv')

# Cible : priorité (haute/moyenne/basse) à définir dans le dataset
X = df.drop(columns=['_id', 'description', 'createdAt', 'status', 'priority', 'resolution_time'])
y = df['priority']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

pred = clf.predict(X_test)
print(classification_report(y_test, pred))

# Sauvegarde du modèle
save_model(clf, 'models/priority_model.joblib')
print("Modèle de priorité sauvegardé.")
