from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Form, HTTPException, Query
from pydantic import BaseModel
from backend.database.psql import init_db
from backend.ingestion.retrival import chunk_text, retrieve_top_k
from backend.utils.fileUtils import extract_text_from_file
from backend.ingestion.ingestion import embed_chunks, store_embeddings_in_chroma
from backend.llm.llm import ask_ollama
from backend.fastapi.session import router as session_router
from fastapi import UploadFile, File
import os
import shutil
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI(on_startup=[init_db])

# CORS setup if frontend on a different port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    context = "\n".join([doc[0] for doc in docs])

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
async def upload_and_ingest(session_id: int = Form(...), file: UploadFile = File(...)):
    try:
        upload_dir = os.path.join(UPLOAD_DIR, str(session_id))
        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(f"{UPLOAD_DIR}/{session_id}", file.filename)

        # 1. Save uploaded file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        print(f"Saved file to {file_path}")

        # 2. Extract text (supports .pdf, .txt, .docx)
        text = extract_text_from_file(file_path)
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from document.")
        
        print("Text extraction successful")

        # 3. Chunk the text
        chunks = chunk_text(text)
        print(f"Chunked into {len(chunks)} pieces")

        # 4. Generate embeddings
        vectors = embed_chunks(chunks)
        print("Embeddings generated")

        # 5. Store embeddings
        store_embeddings_in_chroma(chunks, vectors, file.filename)
        print("Embeddings stored")

        return {"status": "success", "filename": file.filename, "session_id":  session_id, "chunks": len(chunks)}

    except Exception as e:
        print(e.with_traceback)
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/upload")
def list_uploaded_files(session_id: int = Query(...)):
    session_dir = os.path.join(UPLOAD_DIR, str(session_id))
    if not os.path.exists(session_dir):
        return {"files": []}

    files = []
    for fname in os.listdir(session_dir):
        fpath = os.path.join(session_dir, fname)
        files.append({
            "filename": fname,
            "size": os.path.getsize(fpath),
            "uploaded_at": datetime.fromtimestamp(os.path.getmtime(fpath)).isoformat(),
        })

    return {"files": files}

@app.delete("/upload")
def delete_file(session_id: int = Query(...), filename: str = Query(...)):
    path = os.path.join(UPLOAD_DIR, str(session_id), filename)
    if os.path.exists(path):
        os.remove(path)
        return {"status": "deleted"}
    return {"error": "File not found"}

app.include_router(session_router)