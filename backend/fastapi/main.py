from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from retrieval import retrieve_top_k
from llm import ask_ollama

app = FastAPI()

class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

class QueryResponse(BaseModel):
    answer: str
    chunks: list[dict]  # includes text, metadata, distance

@app.post("/query", response_model=QueryResponse)
async def query_endpoint(req: QueryRequest):
    hits = retrieve_top_k(req.question, top_k=req.top_k)
    if not hits:
        raise HTTPException(status_code=404, detail="No relevant chunks found")

    # Format retrieved context for prompt
    context = "\n\n".join([doc for doc, _, _ in hits])

    # Ask Ollama using retrieved context + question
    prompt = (
        f"Use the following extracted document chunks to answer the question.\n\n"
        f"Context:\n{context}\n\nQuestion: {req.question}"
    )
    answer = ask_ollama(prompt)

    chunks_info = [
        {"text": doc, "meta": meta, "distance": dist}
        for doc, meta, dist in hits
    ]

    return QueryResponse(answer=answer, chunks=chunks_info)