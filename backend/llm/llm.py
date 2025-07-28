import requests
import json

import os
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

def ask_ollama(prompt: str, model: str = "mistral") -> str:
    url = f"{OLLAMA_URL}/api/chat"
    payload = {
        "model": model,
        "stream": True,
        "messages": [{"role": "user", "content": prompt}]
    }

    response = requests.post(url, json=payload)
    response.raise_for_status()

    full_content = ""
    for line in response.iter_lines(decode_unicode=True):
        if not line:
            continue
        try:
            data = json.loads(line)
            msg = data.get("message", {})
            content = msg.get("content")
            if content:
                full_content += content
        except json.JSONDecodeError:
            continue

    return full_content or "No response from Ollama"