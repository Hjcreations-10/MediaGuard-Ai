from sentence_transformers import SentenceTransformer
from PIL import Image
import requests
from io import BytesIO
import os

# Pre-load the model at startup to avoid "Cold Start" delay on first request
print("🚀 Initializing CLIP Neural Network model...")
_MODEL = SentenceTransformer('clip-ViT-B-32')
print("✅ CLIP Model ready!")

def get_embedding(image_path_or_url):
    """
    Generates a 512-dimensional embedding for an image using CLIP.
    """
    try:
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
