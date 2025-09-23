import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API base - in dev we proxy, in prod we use env var or relative
export const API_BASE: string = (() => {
  const env: any = (import.meta as any).env;
  const fromEnv = env?.VITE_API_BASE_URL as string | undefined;
  return fromEnv || ""; // relative to same origin by default
})();

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}