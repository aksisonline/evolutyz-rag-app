export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileurl = searchParams.get("fileurl");

  if (!fileurl) {
    return new Response("File url not provided", { status: 400 });
  }

  // @ts-ignore
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  try {
    // Call Python backend to delete file
    const response = await fetch(`${API_URL}/files/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_url: fileurl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();
    return Response.json(result);

  } catch (error) {
    console.error("Delete file error:", error);
    return new Response("Delete failed", { status: 500 });
  }
}
