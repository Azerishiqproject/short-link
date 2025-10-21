import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getOrCreateDeviceId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const storageKey = 'device_id';
    let id = localStorage.getItem(storageKey);
    if (!id) {
      id = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(storageKey, id);
    }
    return id;
  } catch {
    return null;
  }
}
