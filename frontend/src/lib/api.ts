import { PredictResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function predictImage(
  base64Image: string,
): Promise<PredictResponse> {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    const message =
      errBody?.detail?.message ||
      errBody?.message ||
      "Gagal memproses gambar. Coba lagi.";
    throw new Error(message);
  }

  return res.json();
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // buang prefix "data:image/...;base64,"
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
