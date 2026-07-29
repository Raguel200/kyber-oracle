import { describe, expect, it } from "vitest";
import { ARCHETYPES } from "../app/lib/corpus";
import { generateReading, scoreReading } from "../app/lib/engine";
import { restoreReading, serializeReading } from "../app/lib/storage";

describe("moteur symbolique KYBER", () => {
  it("est déterministe pour une même seed", () => {
    const first = generateReading("KYB-DETERMINISME", "Oracle du jour", "Quelle voie ?");
    const second = generateReading("KYB-DETERMINISME", "Oracle du jour", "Quelle voie ?");
    expect(second.cards).toEqual(first.cards);
    expect(second.scores).toEqual(first.scores);
    expect(second.synthesis).toBe(first.synthesis);
  });

  it("reproduit exactement les symboles d’un tirage", () => {
    const first = generateReading("KYB-REPLICA", "Diagnostic d’un projet", "Où se trouve le risque ?");
    const replay = generateReading(first.seed, first.mode, first.question);
    expect(replay.cards.map((card) => ({
      id: card.archetypeId, planet: card.planet, element: card.element, intensity: card.intensity, sigil: card.sigilSeed,
    }))).toEqual(first.cards.map((card) => ({
      id: card.archetypeId, planet: card.planet, element: card.element, intensity: card.intensity, sigil: card.sigilSeed,
    })));
  });

  it("varie entre deux seeds", () => {
    const left = generateReading("KYB-ALPHA", "Présage créatif");
    const right = generateReading("KYB-OMEGA", "Présage créatif");
    expect(right.cards.map((card) => card.archetypeId)).not.toEqual(left.cards.map((card) => card.archetypeId));
  });

  it("conserve les cartes verrouillées", () => {
    const first = generateReading("KYB-LOCK-A", "Conflit / décision");
    const rerolled = generateReading("KYB-LOCK-B", "Conflit / décision", "", [first.cards[0], null, first.cards[2]]);
    expect(rerolled.cards[0]).toEqual(first.cards[0]);
    expect(rerolled.cards[2]).toEqual(first.cards[2]);
    expect(rerolled.cards[1].archetypeId).not.toBe(first.cards[0].archetypeId);
  });

  it("produit des scores valides", () => {
    const reading = generateReading("KYB-SCORES", "Tirage chaotique");
    const scores = scoreReading(reading.cards);
    Object.values(scores).forEach((score) => {
      expect(Number.isInteger(score)).toBe(true);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  it("ne produit aucun archétype invalide", () => {
    const validIds = new Set(ARCHETYPES.map((item) => item.id));
    for (let index = 0; index < 80; index += 1) {
      const reading = generateReading(`KYB-CORPUS-${index}`, "Oracle du jour");
      reading.cards.forEach((card) => expect(validIds.has(card.archetypeId)).toBe(true));
    }
  });

  it("sérialise et restaure un tirage", () => {
    const reading = generateReading("KYB-ARCHIVE", "Diagnostic d’un projet", "Que préserver ?");
    expect(restoreReading(serializeReading(reading))).toEqual(reading);
  });
});
