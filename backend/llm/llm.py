import requests
import json

def ask_ollama(prompt: str, model: str = "mistral") -> str:
    url = "http://localhost:11434/api/chat"
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}]
    }

    response = requests.post(url, json=payload)
    response.raise_for_status()

    # Handle streamed JSON chunks
    for line in response.text.strip().splitlines():
        try:
            data = json.loads(line)
            if "message" in data:
                return data["message"]["content"]
        except json.JSONDecodeError:
            continue

    return "No response from Ollama"