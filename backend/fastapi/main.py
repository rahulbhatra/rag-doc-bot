from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.ingestion.retrival import load_file_text, chunk_text, retrieve_top_k
from backend.ingestion.retrival import retrieve_top_k
from backend.llm.llm import ask_ollama
from fastapi import UploadFile, File
import os
import shutil
from fastapi.responses import StreamingResponse
import json

app = FastAPI()

class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

class QueryResponse(BaseModel):
    answer: str
    chunks: Optional[List[dict]] = None  # includes text, metadata, distance

@app.post("/query", response_model=QueryResponse)
async def query_endpoint(req: QueryRequest):
    question = req.question

    # Step 1: Retrieve relevant context chunks
    docs = retrieve_top_k(question, top_k=3)
    context = "\n".join([doc["content"] for doc in docs])

    # Step 2: Build prompt
    prompt = f"Context:\n{context}\n\nQuestion: {question}\nAnswer:"

    # Step 3: Ask Ollama
    def stream():
        for chunk in ask_ollama(prompt):  # This must be a generator
            yield f"data: {json.dumps(chunk)}\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")

UPLOAD_DIR = "uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename}


@app.get("/upload")
def list_uploaded_files():
    return {"files": os.listdir(UPLOAD_DIR)}

@app.delete("/upload/{filename}")
def delete_file(filename: str):
    path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(path):
        os.remove(path)
        return {"status": "deleted"}
    return {"error": "File not found"}