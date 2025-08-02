from retrival import get_chroma_collection

collection = get_chroma_collection()
print("Total documents:", collection.count())

docs = collection.peek()
for i, doc in enumerate(docs):
    print(i, doc)