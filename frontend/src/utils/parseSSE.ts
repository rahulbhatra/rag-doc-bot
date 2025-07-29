export async function* parseSSE(response: Response): AsyncGenerator<string> {
  console.log("Inside parse SSE");
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    console.log("Inside parse SSE", value, done);
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const segments = buffer.split("\n\n");
    buffer = segments.pop() ?? "";

    console.log(buffer, segments);
    for (const seg of segments) {
      if (seg.startsWith("data:")) {
        yield seg.substring(5);
      }
    }
  }

  // flush remainder if valid
  if (buffer.startsWith("data:")) {
    yield buffer.substring(5);
  }
}