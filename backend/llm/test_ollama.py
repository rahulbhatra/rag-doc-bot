import pytest
from llm import ask_ollama

def test_ollama_vector_search_response():
    prompt = "What is vector search used for in LLM applications?"
    response = ask_ollama(prompt)
    assert isinstance(response, str), "Response should be a string"
    assert "vector" in response.lower(), "Expected 'vector' to be mentioned in the response"