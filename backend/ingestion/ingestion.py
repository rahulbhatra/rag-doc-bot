import os
from pathlib import Path
from typing import List
from PyPDF2 import PdfReader
from retrival import load_file_text, chunk_text
from sentence_transformers import SentenceTransformer
import chromadb

def embed_chunks(chunks: List[str], model_name: str = "all-MiniLM-L6-v2") -> List[List[float]]:
    model = SentenceTransformer(model_name)
    return model.encode(chunks, show_progress_bar=True).tolist()

def store_in_chroma(chunks: List[str], embeddings: List[List[float]], doc_id: str):
    client = chromadb.PersistentClient(path="chroma_db")
    # client = chromadb.Client(Settings(chroma_db_impl="duckdb+parquet", persist_directory="chroma_db"))
    collection = client.get_or_create_collection(name="docs")

    documents = chunks
    metadatas = [{"doc_id": doc_id, "chunk_index": i} for i in range(len(chunks))]
    ids = [f"{doc_id}_{i}" for i in range(len(chunks))]

    collection.add(
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )

    print(f"✅ Stored {len(chunks)} chunks for {doc_id}")

if __name__ == "__main__":
    file_path = "sample.md"  # replace with your actual file
    doc_id = Path(file_path).stem

    full_text = load_file_text(file_path)
    chunks = chunk_text(full_text)
    embeddings = embed_chunks(chunks)
    store_in_chroma(chunks, embeddings, doc_id)