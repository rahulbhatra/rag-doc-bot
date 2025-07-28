from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.ingestion.retrival import load_file_text, chunk_text, retrieve_top_k
from backend.ingestion.retrival import retrieve_top_k
from backend.llm.llm import ask_ollama

app = FastAPI()

class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

class QueryResponse(BaseModel):
    answer: str
    chunks: list[dict]  # includes text, metadata, distance

@app.post("/query", response_model=QueryResponse)
async def query_endpoint(req: QueryRequest):
    question = req.question

    # Step 1: Retrieve relevant context chunks
    docs = retrieve_top_k(question, top_k=3)
    context = "\n".join([doc["content"] for doc in docs])

    # Step 2: Build prompt
    prompt = f"Context:\n{context}\n\nQuestion: {question}\nAnswer:"

    # Step 3: Ask Ollama
    answer = ask_ollama(prompt)

    return {
        "question": question,
        "answer": answer,
        "context": context,
    }