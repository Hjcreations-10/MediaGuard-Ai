import numpy as np
from database import get_vector_matrix

def classify(score):
    """
    Classifies the match based on confidence score.
    Lowered threshold to 0.90 for original match to be more robust.
    """
    if score > 0.90:
        return "Original / Exact Match"
    elif score > 0.75:
        return "Modified Version"
    elif score > 0.60:
        return "Suspicious / Similar Content"
    else:
        return "No Match Found"

def find_best_match(target_embedding):
    """
    Finds the best match in the database using vectorized cosine similarity.
    """
    matrix, names = get_vector_matrix()
    if matrix is None or len(names) == 0:
        return None, 0.0
    
    target = np.array(target_embedding)
    
    # Normalize vectors for cosine similarity via dot product
    # Similarity = (A . B) / (||A|| * ||B||)
    matrix_norm = np.linalg.norm(matrix, axis=1)
    target_norm = np.linalg.norm(target)
    
    # Avoid division by zero
    if target_norm == 0:
        return None, 0.0
    
    similarities = np.dot(matrix, target) / (matrix_norm * target_norm)
    
    best_idx = np.argmax(similarities)
    best_score = similarities[best_idx]
    best_match = names[best_idx]
            
    return best_match, best_score
