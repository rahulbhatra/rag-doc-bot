from typing import Any, Generator
import requests
import json

import os
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

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