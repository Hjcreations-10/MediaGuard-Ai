from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from model import get_embedding
from similarity import find_best_match, classify
from database import save_fingerprint, get_vector_matrix

app = FastAPI(title="Media Fingerprinting API")
print("🚀 MediaGuard Backend is starting up...")

# Enable CORS for frontend and extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp_uploads"
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

@app.post("/register")
async def register_media(name: str = Form(...), file: UploadFile = File(...)):
    """
    Registers a new original media fingerprint.
    """
    file_path = os.path.join(TEMP_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    embedding = get_embedding(file_path)
    if embedding is None:
        if os.path.exists(file_path): os.remove(file_path)
        raise HTTPException(status_code=500, detail="Failed to generate embedding")
    
    save_fingerprint(name, embedding)
    os.remove(file_path)
    
    return {"message": f"Successfully registered {name}"}

@app.post("/verify")
async def verify_media(file: UploadFile = File(...)):
    """
    Verifies an uploaded file against the database.
    """
    file_path = os.path.join(TEMP_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    embedding = get_embedding(file_path)
    if embedding is None:
        if os.path.exists(file_path): os.remove(file_path)
        raise HTTPException(status_code=500, detail="Failed to generate embedding")
    
    best_match, best_score = find_best_match(embedding)
    if os.path.exists(file_path): os.remove(file_path)
    
    return {
        "status": classify(best_score),
        "score": float(best_score),
        "matched_with": best_match if best_match else "None"
    }

@app.get("/scan-url")
async def scan_url(url: str):
    """
    Scans a media URL (used by the browser extension).
    """
    embedding = get_embedding(url)
    if embedding is None:
        raise HTTPException(status_code=400, detail="Could not process image URL")
    
    best_match, best_score = find_best_match(embedding)
    
    return {
        "status": classify(best_score),
        "score": float(best_score),
        "matched_with": best_match if best_match else "None"
    }

@app.get("/assets")
async def list_assets():
    """
    Returns a list of all registered asset names.
    """
    _, names = get_vector_matrix()
    return {"assets": names}

@app.get("/health")
async def health():
    return {"status": "online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)