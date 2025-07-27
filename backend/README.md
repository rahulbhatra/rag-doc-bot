# RAG DOC BOT BACKEND

### Install LLM Ollama
1. Install: brew install ollama
2. Start: ollama serve
3. Run Modal: ollama run mistral URL (https://ollama.com/library/mistral)

### Run Ollama
ollama run mistral

### Create python enviorment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt


### Luanch the server
uvicorn main:app --reload