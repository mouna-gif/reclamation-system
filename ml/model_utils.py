# model_utils.py

import joblib
from sklearn.pipeline import Pipeline


def save_model(pipeline: Pipeline, path: str):
    joblib.dump(pipeline, path)


def load_model(path: str):
    return joblib.load(path)

