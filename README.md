# rag-doc-bot

## ✨ Features

- 📄 Upload documents (PDF, Markdown, plain text)
- 🔍 Vector-based semantic search using embeddings
- 🤖 GPT-powered responses grounded in your docs
- 🔗 References to original document chunks
- ⚡ REST API with FastAPI
- 🖥️ Simple Streamlit-based frontend UI
- 📦 Dockerized setup for easy deployment

## 🧠 RAG Doc Bot Backend

A lightweight local Retrieval-Augmented Generation (RAG) backend that allows you to ingest documents, chunk and embed them using `sentence-transformers`, store them in `ChromaDB`, and query them using a local LLM (via [Ollama](https://ollama.com)).

Built with:
- 🦜 ChromaDB for vector storage
- 🤗 SentenceTransformers for embedding
- 🔥 FastAPI for serving
- 🦙 Mistral via Ollama for local LLM chat

### Run Docker Compose
docker-compose up --build