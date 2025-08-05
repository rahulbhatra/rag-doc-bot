from pathlib import Path
from typing import List
from pypdf import PdfReader
import chromadb
from sentence_transformers import SentenceTransformer

MODEL_NAME = "all-MiniLM-L6-v2"
CHROMA_DIR = "chroma_db"
COLLECTION_NAME = "docs"

def get_chroma_collection(path: str = CHROMA_DIR, name: str = COLLECTION_NAME):
    client = chromadb.PersistentClient(path=path)
    return client.get_or_create_collection(name=name)

def embed_query(query: str, model_name: str = MODEL_NAME):
    model = SentenceTransformer(model_name)
    embedding = model.encode([query])[0]
    return embedding.tolist()

def retrieve_top_k(query: str, session_id: int, top_k: int = 3):
    collection = get_chroma_collection()
    query_embedding = embed_query(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
        where={"session_id": session_id}
    )
    # results is a dict of lists-of-lists; since we passed one query, use index 0
    docs = results["documents"][0]
    metas = results["metadatas"][0]
    dists = results["distances"][0]
    return list(zip(docs, metas, dists))

@DeprecationWarning
def load_file_text(path: str) -> str:
    ext = Path(path).suffix.lower()
    if ext in [".txt", ".md"]:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    elif ext == ".pdf":
        reader = PdfReader(path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    else:
        raise ValueError(f"Unsupported file type: {ext}")
    
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

if __name__ == "__main__":
    query = "What is vector search?"
    hits = retrieve_top_k(query, 0, top_k=1)
    for doc, meta, dist in hits:
        print(f"Doc chunk: {doc[:80]}… | meta={meta} | distance={dist:.4f}")