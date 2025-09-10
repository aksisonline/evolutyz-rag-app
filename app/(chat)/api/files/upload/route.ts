export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return new Response("Filename is required", { status: 400 });
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  // @ts-ignore
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  try {
    // Determine file type and route to appropriate endpoint
    const isCSV = filename.toLowerCase().endsWith('.csv');
    const isPDF = filename.toLowerCase().endsWith('.pdf');
    
    if (!isCSV && !isPDF) {
      return new Response("Only CSV and PDF files are supported", { status: 400 });
    }

    const endpoint = isCSV ? '/ingestion/csv' : '/ingestion/pdf';
    
    // Create FormData to send to Python backend
    const formData = new FormData();
    const arrayBuffer = await request.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    formData.append('file', blob, filename);

    // Forward to Python backend
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();
    return Response.json(result);

  } catch (error) {
    console.error("Upload error:", error);
    return new Response("Upload failed", { status: 500 });
  }
}
