import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const buildUrl = (
  endpoint: string,
  queryParams?: Record<string, string | number | boolean>
) => {
  if (!queryParams) return endpoint;
  const params = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  return `${import.meta.env.VITE_API_BASE_URL}/${endpoint}?${params.toString()}`;
};
