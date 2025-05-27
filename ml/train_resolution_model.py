# train_resolution_model.py

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from model_utils import save_model

# Charger données
df = pd.read_csv('data/processed.csv')

# Cible : resolution_time (en heures)
X = df.drop(columns=['_id', 'description', 'createdAt', 'status', 'priority', 'resolution_time'])
y = df['resolution_time']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

reg = RandomForestRegressor(n_estimators=100, random_state=42)
reg.fit(X_train, y_train)

pred = reg.predict(X_test)
print(f"RMSE: {mean_squared_error(y_test, pred, squared=False):.2f} heures")

# Sauvegarde du modèle
save_model(reg, 'models/resolution_model.joblib')
print("Modèle de temps de résolution sauvegardé.")
