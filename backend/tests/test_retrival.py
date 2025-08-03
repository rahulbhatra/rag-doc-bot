import pytest
import chromadb

CLIENT_PATH = "chroma_db_test"

@pytest.fixture(scope="function")
def chroma_client(tmp_path):
    # Create a temporary directory for testing
    client = chromadb.PersistentClient(path=str(tmp_path / CLIENT_PATH))
    yield client
    # No need to clear: using tmp_path cleans up after test

@pytest.fixture(scope="function")
def populated_collection(chroma_client):
    col = chroma_client.get_or_create_collection(name="docs")
    # Add dummy data
    docs = ["hello world", "another doc"]
    embeddings = [[0.1] * 10, [0.2] * 10]  # dummy vectors
    ids = ["doc1", "doc2"]
    metadatas = [{"chunk_index": 0}, {"chunk_index": 1}]
    col.add(ids=ids, documents=docs, embeddings=embeddings, metadatas=metadatas)
    return col

def test_collection_count(populated_collection):
    count = populated_collection.count()
    assert count == 2, "Expected 2 documents in collection"

def test_retrieve_documents(populated_collection):
    result = populated_collection.get(limit=2)
    assert "ids" in result and "documents" in result and "metadatas" in result
    assert len(result["documents"]) == 2
    assert result["metadatas"][0]["chunk_index"] == 0
    assert result["metadatas"][1]["chunk_index"] == 1