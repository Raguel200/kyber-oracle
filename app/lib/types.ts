export const MODES = [
  "Oracle du jour",
  "Diagnostic d’un projet",
  "Présage créatif",
  "Conflit / décision",
  "Tirage chaotique",
] as const;

export type OracleMode = (typeof MODES)[number];
export type Planet = "Soleil" | "Lune" | "Mercure" | "Vénus" | "Mars" | "Jupiter" | "Saturne";
export type Element = "Feu" | "Eau" | "Air" | "Terre" | "Éther";
export type Polarity = "Ascendante" | "Descendante" | "Liminale";
export type Position = "Force dominante" | "Obstacle caché" | "Mutation nécessaire";

export interface Archetype {
  id: string;
  name: string;
  number: string;
  planets: Planet[];
  elements: Element[];
  polarity: Polarity;
  baseIntensity: number;
  oracle: string;
  interpretation: string;
  action: string;
  conflicts: string[];
  tags: string[];
}

export interface OracleCard {
  archetypeId: string;
  name: string;
  number: string;
  planet: Planet;
  element: Element;
  polarity: Polarity;
  intensity: number;
  oracle: string;
  interpretation: string;
  action: string;
  position: Position;
  sigilSeed: string;
}

export interface OracleScores {
  tension: number;
  expansion: number;
  stability: number;
  mutation: number;
}

export interface OracleReading {
  version: 1;
  id: string;
  seed: string;
  mode: OracleMode;
  question: string;
  createdAt: string;
  cards: [OracleCard, OracleCard, OracleCard];
  scores: OracleScores;
  synthesis: string;
}

