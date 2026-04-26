import os
from app.model import get_embedding
from app.database import save_db

DATASET_PATH = "dataset"
db = {}

for file in os.listdir(DATASET_PATH):
    path = os.path.join(DATASET_PATH, file)
    if file.endswith((".jpg", ".png", ".jpeg")):
        print(f"Processing {file}...")
        emb = get_embedding(path)
        db[file] = emb

save_db(db)
print("Database created successfully!")