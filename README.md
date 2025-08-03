# rag-doc-bot
A **document‑grounded Retrieval‑Augmented Generation (RAG) chatbot** built with FastAPI, ChromaDB, and a local AI model via Ollama. Streamlined React chat UI with chat session and document management.

---

## 🌟 Features

| Feature                    | Behavior                                                             |
|----------------------------|----------------------------------------------------------------------|
| **Chat Session management**     | Create, name, view, and delete chat sessions with title auto‑generated from first user message |
| **File support**           | Upload PDF, TXT, DOCX to link documents to specific sessions         |
| **Text extraction**        | Converts files into chunks ready for embedding generation            |
| **Semantic indexing**      | Embeddings created with Sentence‑Transformers and stored in ChromaDB  [oai_citation:0‡FreeCodeCamp](https://www.freecodecamp.org/news/how-to-run-open-source-llms-locally-using-ollama/?utm_source=chatgpt.com) [oai_citation:1‡GitHub](https://github.com/langchain-ai/langchain/discussions/7818?utm_source=chatgpt.com) [oai_citation:2‡DEV Community](https://dev.to/msbala007/building-a-simple-powerful-chatbot-using-chromadb-and-sentence-transformers-4md?utm_source=chatgpt.com) |
| **Proactive retrieval**    | Top‑K chunk search per query, optimized for speed and relevance     |
| **Streaming replies**      | Assistant messages streamed chunk‑wise for fluid UX                  |
| **Web‑based chat UI**      | React chat interface with session sidebar, editable titles, and smooth scrolling |
| **Local LLM engine**       | Uses Ollama for local, offline inference with private data support   [oai_citation:3‡FreeCodeCamp](https://www.freecodecamp.org/news/how-to-run-open-source-llms-locally-using-ollama/?utm_source=chatgpt.com) [oai_citation:4‡LangChain](https://python.langchain.com/docs/how_to/local_llms/?utm_source=chatgpt.com) |
| **CI/CD ready**            | GitHub Actions workflow with back‑end pytest and front‑end Vitest tests |
| **Docker‑compose deployment** | Full stack up via `docker-compose up --build`                      |

---

## 🚀 Value Proposition

Built for knowledge teams, recruiters, and power users to quickly index documents and engage with them using chat. With enterprise‑grade features like secure local LLM inference and session‑bound contexts, RAG‑Doc‑Bot allows:

- Instant insights from uploaded documents  
- Customizable conversation flow per session  
- Faster knowledge retrieval than manual search  
- Full auditability and control over chat data and embeddings

---

## 🧱 Tech Stack

- **FastAPI** – core back‑end REST API and ingest/travel logic  
- **SQLModel** – PostgreSQL backed models for session & message storage  
- **ChromaDB** – local vector database optimized for semantic search  [oai_citation:5‡docs.datarobot.com](https://docs.datarobot.com/en/docs/gen-ai/genai-code/chromadb-vdb.html?utm_source=chatgpt.com) [oai_citation:6‡DEV Community](https://dev.to/msbala007/building-a-simple-powerful-chatbot-using-chromadb-and-sentence-transformers-4md?utm_source=chatgpt.com) [oai_citation:7‡Analytics Vidhya](https://www.analyticsvidhya.com/blog/2023/07/guide-to-chroma-db-a-vector-store-for-your-generative-ai-llms/?utm_source=chatgpt.com)  
- **Sentence‑Transformers** – embedding model (e.g. `all‑MiniLM‑L6‑v2`)  
- **Ollama** – runs LLM locally; full privacy and offline inference  [oai_citation:8‡Hugging Face](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2?utm_source=chatgpt.com) [oai_citation:9‡FreeCodeCamp](https://www.freecodecamp.org/news/how-to-run-open-source-llms-locally-using-ollama/?utm_source=chatgpt.com)  
- **React (TypeScript)** – intuitive chat UI, live messaging, drag‑and‑drop uploads  
- **TanStack Query** – data fetching & state management  
- **Tailwind CSS** – responsive styling and animation  


## 🛠 Installation & Usage

### Prerequisites

- Python 3.11+, Postgres (if not using Docker)
- Node.js v18+ (or 20.x)
- [Ollama](https://ollama.com/) installed and a local LLM downloaded (e.g., `ollama pull llama3.2`)

### Quick Start (Docker)

```bash
cd /path/to/project
docker-compose up --build
```
### Manual startup (dev mode)
```bash
# Backend
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.fastapi.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
pytest backend/tests --junitxml=backend-test-reports/junit.xml

# Frontend
cd frontend
npm install
CI=true npx vitest run --coverage
```
