from sentence_transformers import SentenceTransformer
from PIL import Image
import requests
from io import BytesIO
import os

# global variable to hold the model
_MODEL = None

def get_embedding(image_path_or_url):
    """
    Generates a 512-dimensional embedding for an image using CLIP.
    Loads the model lazily on first request to speed up container startup.
    """
    global _MODEL
    
    try:
        if _MODEL is None:
            print("Lazy loading CLIP model (first request)...")
            _MODEL = SentenceTransformer('clip-ViT-B-32')
            print("Model loaded successfully!")

        if image_path_or_url.startswith(('http://', 'https://')):
            response = requests.get(image_path_or_url, timeout=10)
            img = Image.open(BytesIO(response.content))
        else:
            img = Image.open(image_path_or_url)
            
        embedding = _MODEL.encode(img)
        return embedding.tolist()
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return None
