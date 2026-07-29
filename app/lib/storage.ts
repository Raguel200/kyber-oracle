import { MODES, type OracleReading } from "./types";

export const STORAGE_KEY = "kyber-oracle:readings:v1";
const MAX_READINGS = 50;

function isReading(value: unknown): value is OracleReading {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<OracleReading>;
  return item.version === 1
    && typeof item.id === "string"
    && typeof item.seed === "string"
    && typeof item.createdAt === "string"
    && typeof item.mode === "string"
    && MODES.includes(item.mode as OracleReading["mode"])
    && Array.isArray(item.cards)
    && item.cards.length === 3
    && item.cards.every((card) => card && typeof card.name === "string" && typeof card.archetypeId === "string")
    && !!item.scores;
}

export function deserializeReadings(raw: string | null): OracleReading[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isReading).slice(0, MAX_READINGS);
  } catch {
    return [];
  }
}

export function loadReadings(): OracleReading[] {
  if (typeof window === "undefined") return [];
  return deserializeReadings(window.localStorage.getItem(STORAGE_KEY));
}

export function persistReadings(readings: OracleReading[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(readings.slice(0, MAX_READINGS)));
}

export function upsertReading(readings: OracleReading[], reading: OracleReading): OracleReading[] {
  return [reading, ...readings.filter((item) => item.id !== reading.id)].slice(0, MAX_READINGS);
}

export function serializeReading(reading: OracleReading): string {
  return JSON.stringify(reading);
}

export function restoreReading(raw: string): OracleReading {
  const parsed: unknown = JSON.parse(raw);
  if (!isReading(parsed)) throw new Error("Tirage invalide ou incompatible.");
  return parsed;
}

