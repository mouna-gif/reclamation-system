# serve_model.py

from flask import Flask, request, jsonify
from model_utils import load_model
import pandas as pd

app = Flask(__name__)

# Charger les modèles
priority_model = load_model('models/priority_model.joblib')
time_model = load_model('models/resolution_model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # attend un dict avec mêmes features que training
    df = pd.DataFrame([data])
    pri = priority_model.predict(df)[0]
    time = time_model.predict(df)[0]
    return jsonify({ 'priority': pri, 'estimated_resolution_time': time })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
