import { ARCHETYPES, PLANET_AFFINITIES } from "./corpus";
import { MODES, type Archetype, type OracleCard, type OracleMode, type OracleReading, type OracleScores, type Position } from "./types";

const POSITIONS: Position[] = ["Force dominante", "Obstacle caché", "Mutation nécessaire"];

export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createRng(seed: string): () => number {
  let state = hashString(seed) || 0x9e3779b9;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function normalizeSeed(seed: string): string {
  return seed.trim().replace(/\s+/g, "-").slice(0, 64) || "KYBER-NULL";
}

export function createSeed(mode: OracleMode, question = ""): string {
  const entropy = globalThis.crypto?.getRandomValues
    ? Array.from(globalThis.crypto.getRandomValues(new Uint32Array(2))).join("-")
    : `${Date.now()}-${Math.random()}`;
  return `KYB-${hashString(`${mode}|${question}|${entropy}`).toString(16).toUpperCase().padStart(8, "0")}`;
}

function modeWeight(archetype: Archetype, mode: OracleMode): number {
  const wanted: Record<OracleMode, string[]> = {
    "Oracle du jour": ["intuition", "clarté", "relation"],
    "Diagnostic d’un projet": ["projet", "système", "risque"],
    "Présage créatif": ["création", "innovation", "signal"],
    "Conflit / décision": ["conflit", "décision", "pouvoir"],
    "Tirage chaotique": ["mutation", "tabou", "expansion"],
  };
  return 1 + archetype.tags.filter((tag) => wanted[mode].includes(tag)).length * 1.7;
}

function weightedPick(rng: () => number, items: Archetype[], mode: OracleMode, excluded: Set<string>): Archetype {
  const pool = items.filter((item) => !excluded.has(item.id));
  const weights = pool.map((item) => modeWeight(item, mode));
  let cursor = rng() * weights.reduce((sum, weight) => sum + weight, 0);
  for (let i = 0; i < pool.length; i += 1) {
    cursor -= weights[i];
    if (cursor <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

function buildCard(archetype: Archetype, position: Position, seed: string, index: number, rng: () => number): OracleCard {
  const planet = archetype.planets[Math.floor(rng() * archetype.planets.length)];
  const elementPool = [...archetype.elements].sort((left, right) => {
    const affinities = PLANET_AFFINITIES[planet];
    return Number(affinities.includes(right)) - Number(affinities.includes(left));
  });
  const element = elementPool[Math.floor(rng() * Math.min(2, elementPool.length))];
  const affinity = PLANET_AFFINITIES[planet].includes(element) ? 1 : -1;
  const positional = position === "Obstacle caché" ? 1 : position === "Mutation nécessaire" ? (rng() > 0.5 ? 1 : 0) : 0;
  const intensity = Math.max(1, Math.min(5, archetype.baseIntensity + affinity + positional - 1));
  return { archetypeId: archetype.id, name: archetype.name, number: archetype.number, planet, element, polarity: archetype.polarity, intensity, oracle: archetype.oracle, interpretation: archetype.interpretation, action: archetype.action, position, sigilSeed: `${seed}|${index}|${archetype.id}` };
}

export function scoreReading(cards: OracleCard[]): OracleScores {
  let tension = 18;
  let expansion = 18;
  let stability = 18;
  let mutation = 18;
  cards.forEach((card) => {
    tension += card.intensity * 7 + (card.polarity === "Descendante" ? 8 : 0);
    expansion += (card.polarity === "Ascendante" ? 16 : 5) + (["Jupiter", "Soleil"].includes(card.planet) ? 8 : 0);
    stability += (["Terre", "Eau"].includes(card.element) ? 13 : 5) + (card.planet === "Saturne" ? 10 : 0);
    mutation += (card.polarity === "Liminale" ? 17 : 6) + (card.element === "Éther" ? 10 : 0);
  });
  for (let i = 0; i < cards.length; i += 1) {
    for (let j = i + 1; j < cards.length; j += 1) {
      const left = ARCHETYPES.find((item) => item.id === cards[i].archetypeId);
      if (left?.conflicts.includes(cards[j].archetypeId)) tension += 14;
      if (cards[i].element === cards[j].element) stability += 7;
      if (cards[i].planet === cards[j].planet) expansion += 5;
    }
  }
  const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
  return { tension: clamp(tension), expansion: clamp(expansion), stability: clamp(stability), mutation: clamp(mutation) };
}

function synthesize(scores: OracleScores, cards: OracleCard[]): string {
  const dominant = (Object.entries(scores) as [keyof OracleScores, number][]).sort((a, b) => b[1] - a[1])[0][0];
  const openings: Record<keyof OracleScores, string> = {
    tension: "Le système approche un seuil : la friction doit devenir information avant de devenir rupture.",
    expansion: "Une fenêtre d’extension s’ouvre, mais elle exige un axe clair pour ne pas se disperser.",
    stability: "La matière résiste assez pour porter le prochain geste ; consolide avant d’accélérer.",
    mutation: "L’ancienne forme ne peut plus contenir ce qui arrive : le passage demande une métamorphose consciente.",
  };
  return `${openings[dominant]} ${cards[0].name} fournit l’énergie, ${cards[1].name} révèle le coût invisible, et ${cards[2].name} indique le geste de transformation.`;
}

export function generateReading(seedInput: string, mode: OracleMode, question = "", locked: Array<OracleCard | null> = [null, null, null]): OracleReading {
  if (!MODES.includes(mode)) throw new Error("Mode oracle invalide.");
  const seed = normalizeSeed(seedInput);
  const rng = createRng(`${seed}|${mode}|${question.trim().toLocaleLowerCase("fr")}`);
  const used = new Set(locked.filter(Boolean).map((card) => card!.archetypeId));
  const cards = POSITIONS.map((position, index) => {
    if (locked[index]) return { ...locked[index]!, position };
    const picked = weightedPick(rng, ARCHETYPES, mode, used);
    used.add(picked.id);
    return buildCard(picked, position, seed, index, rng);
  }) as [OracleCard, OracleCard, OracleCard];
  const scores = scoreReading(cards);
  return {
    version: 1,
    id: `${hashString(`${seed}|${mode}|${question}`).toString(36)}-${Date.now().toString(36)}`,
    seed,
    mode,
    question: question.trim(),
    createdAt: new Date().toISOString(),
    cards,
    scores,
    synthesis: synthesize(scores, cards),
  };
}

