from datetime import datetime
import os
from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile

from backend.ingestion.ingestion import embed_chunks, store_embeddings_in_chroma
from backend.ingestion.retrival import chunk_text
from backend.utils.fileUtils import extract_text_from_file

router = APIRouter(
    prefix="/upload",
    tags=["upload"]
)

UPLOAD_DIR = "uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("")
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
        store_embeddings_in_chroma(chunks, vectors, file.filename, session_id)
        print("Embeddings stored")

        return {"status": "success", "filename": file.filename, "session_id":  session_id, "chunks": len(chunks)}

    except Exception as e:
        print(e.with_traceback)
        raise HTTPException(status_code=500, detail=str(e))



@router.get("")
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

@router.delete("")
def delete_file(session_id: int = Query(...), filename: str = Query(...)):
    path = os.path.join(UPLOAD_DIR, str(session_id), filename)
    if os.path.exists(path):
        os.remove(path)
        return {"status": "deleted"}
    return {"error": "File not found"}