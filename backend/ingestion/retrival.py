from pathlib import Path
from typing import List
from PyPDF2 import PdfReader

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