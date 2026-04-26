import numpy as np
import csv
import os
from google.cloud import firestore

# Initialize Firestore
try:
    # Use environment variable if available, otherwise fallback to the hardcoded ID
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "mediaguard-ai-494505")
    db_client = firestore.Client(project=project_id)
    collection = db_client.collection("fingerprints")
    print(f"✅ Firestore connected to project: {project_id}")
except Exception as e:
    print(f"⚠️ Firestore connection failed: {e}")
    collection = None

# Cache in memory for speed
_VECTORS = []
_NAMES = []

def load_from_firestore():
    """
    Loads all fingerprints from Firestore into memory cache at startup.
    """
    global _VECTORS, _NAMES
    if collection:
        try:
            docs = collection.stream()
            _VECTORS = []
            _NAMES = []
            for doc in docs:
                data = doc.to_dict()
                _NAMES.append(data['name'])
                _VECTORS.append(data['embedding'])
            print(f"✅ Loaded {len(_NAMES)} fingerprints from Firestore")
        except Exception as e:
            print(f"Error loading from Firestore: {e}")

def save_fingerprint(name, embedding):
    """
    Saves a new fingerprint to both Firestore and memory cache.
    """
    global _VECTORS, _NAMES
    _NAMES.append(name)
    _VECTORS.append(embedding)
    
    if collection:
        try:
            collection.document(name).set({
                'name': name,
                'embedding': embedding,
                'timestamp': firestore.SERVER_TIMESTAMP
            })
            print(f"✅ Fingerprint '{name}' saved permanently")
        except Exception as e:
            print(f"Error saving to Firestore: {e}")

def get_vector_matrix():
    """
    Returns the vectors as a NumPy matrix and the list of names.
    """
    if not _VECTORS:
        # Try a quick reload if memory is empty
        load_from_firestore()
        if not _VECTORS: return None, []
        
    return np.array(_VECTORS), _NAMES

# Initial load
load_from_firestore()
