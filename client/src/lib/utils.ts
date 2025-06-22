import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLocation(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'safe':
    case 'sent':
    case 'granted':
      return 'text-green-400 bg-green-900/30 border-green-700';
    case 'alert':
    case 'triggered':
    case 'pending':
      return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
    case 'failed':
    case 'denied':
      return 'text-red-400 bg-red-900/30 border-red-700';
    default:
      return 'text-slate-400 bg-slate-900/30 border-slate-700';
  }
}
