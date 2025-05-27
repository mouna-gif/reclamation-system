# data_preparation.py

import argparse
import pandas as pd
from pymongo import MongoClient

# Exemple de préparation : import depuis MongoDB et export CSV

def load_data(mongo_uri, db_name, collection_name):
    client = MongoClient(mongo_uri)
    db = client[db_name]
    collection = db[collection_name]
    df = pd.DataFrame(list(collection.find()))
    return df


def preprocess(df):
    # Exemple de features : longueur description, catégorie encodée, ancienneté
    df = df.dropna(subset=['description', 'createdAt', 'status'])
    df['description_length'] = df['description'].str.len()
    df['age_hours'] = (pd.Timestamp.now() - pd.to_datetime(df['createdAt'])).dt.total_seconds() / 3600
    df = pd.get_dummies(df, columns=['category'], prefix='cat')
    return df


def main(args):
    df = load_data(args.mongo_uri, args.db, args.collection)
    df_pre = preprocess(df)
    df_pre.to_csv(args.output, index=False)
    print(f"Données prétraitées exportées vers {args.output}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', help='Fichier JSON en entrée', default=None)
    parser.add_argument('--output', help='Fichier CSV en sortie', required=True)
    parser.add_argument('--mongo-uri', default='mongodb://127.0.0.1:27017')
    parser.add_argument('--db', default='reclamation-system')
    parser.add_argument('--collection', default='complaints')
    args = parser.parse_args()
    main(args)
