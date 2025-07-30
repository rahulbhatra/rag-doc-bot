from typing import Any, Generator, List
import requests
import json

import os
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
EMBEDDING_API = os.getenv("EMBEDDING_API_URL", "http://localhost:11434/api/embeddings")

def ask_ollama(prompt: str, model: str = "mistral") -> Generator[dict[str, Any], Any, None]:
    url = f"{OLLAMA_URL}/api/chat"
    payload = {
        "model": model,
        "stream": True,
        "messages": [{"role": "user", "content": prompt}]
    }

    with requests.post(url, json=payload, stream=True) as response:
        response.raise_for_status()
        for line in response.iter_lines():
            if line:
                try:
                    data = json.loads(line)
                    if "message" in data:
                        yield {"answer": data["message"]["content"]}
                except json.JSONDecodeError:
                    continue


def embed_chunks_ollama(chunks: List[str]) -> List[List[float]]:
    """
    Takes a list of text chunks and returns list of corresponding embedding vectors.
    """
    try:
        response = requests.post(EMBEDDING_API, json={"model": "nomic-embed-text", "prompt": chunks})
        response.raise_for_status()
        data = response.json()

        if "embeddings" not in data:
            raise ValueError("No 'embeddings' field in response")

        return data["embeddings"]

    except Exception as e:
        raise RuntimeError(f"Embedding failed: {str(e)}")