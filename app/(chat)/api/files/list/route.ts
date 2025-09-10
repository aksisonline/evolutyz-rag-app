export async function GET() {
  // @ts-ignore
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  try {
    // Call Python backend to get list of files
    const response = await fetch(`${API_URL}/files/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const files = await response.json();
    return Response.json(files);

  } catch (error) {
    console.error("List files error:", error);
    // Return empty array as fallback
    return Response.json([]);
  }
}
