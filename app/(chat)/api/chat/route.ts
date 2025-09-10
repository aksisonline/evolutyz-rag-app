export async function POST(request: Request) {
  const { id, messages, selectedFilePathnames } = await request.json();
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  
  try {
    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const query = lastMessage?.content || "";
    
    // Call our Python backend streaming endpoint
    const response = await fetch(`${API_URL}/query/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: query,
        filters: selectedFilePathnames && selectedFilePathnames.length > 0 
          ? { "selected_files": selectedFilePathnames } 
          : {},
        top_k: 5
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    // Create a text stream from the SSE response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const content = line.slice(6); // Remove 'data: ' prefix
                if (content === '') {
                  // Empty data line represents a line break
                  controller.enqueue(encoder.encode('\n'));
                } else if (content.trim()) {
                  // Regular content
                  controller.enqueue(encoder.encode(content));
                }
              } else if (line.trim() && !line.startsWith('event:') && !line.startsWith('id:')) {
                // Handle lines that don't have the 'data: ' prefix but contain content
                controller.enqueue(encoder.encode(line.trim()));
              }
            }
          }
        } catch (error) {
          console.error('Stream reading error:', error);
        } finally {
          controller.close();
        }
      }
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Sorry, there was an error processing your request.", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
