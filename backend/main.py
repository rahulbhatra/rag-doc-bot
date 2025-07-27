from dotenv import load_dotenv
import os
from fastapi import FastAPI
from openai import OpenAI

load_dotenv()


app = FastAPI()

@app.get("/")
def root():
    return {"message": "RAG DocBot is running!"}