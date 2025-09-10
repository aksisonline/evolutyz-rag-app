interface ApplicationError extends Error {
  info: string;
  status: number;
}


export const fetcher = async (url: string) => {
  // @ts-ignore
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const fullUrl = url.startsWith("http") ? url : `${API_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  const res = await fetch(fullUrl);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}
