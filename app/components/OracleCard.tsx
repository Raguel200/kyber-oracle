"use client";

import { motion } from "framer-motion";
import { Lock, LockOpen, RotateCcw } from "lucide-react";
import type { OracleCard as OracleCardType } from "../lib/types";
import { Sigil } from "./Sigil";

export function OracleCard({
  card,
  index,
  revealed,
  locked,
  onReveal,
  onToggleLock,
}: {
  card: OracleCardType;
  index: number;
  revealed: boolean;
  locked: boolean;
  onReveal: () => void;
  onToggleLock: () => void;
}) {
  return (
    <article className={`oracle-card-shell card-${index + 1} ${revealed ? "is-revealed" : ""}`}>
      <motion.div
        className="oracle-card"
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: index * 0.06 }}
      >
        <button className="card-face card-back" onClick={onReveal} aria-label={`Retourner la carte ${index + 1}, ${card.position}`}>
          <span className="corner-code">K/{String(index + 1).padStart(2, "0")}</span>
          <Sigil seed={`${card.sigilSeed}|sealed`} />
          <span className="card-position">{card.position}</span>
          <span className="reveal-hint"><RotateCcw size={14} aria-hidden /> retourner</span>
        </button>
        <div className="card-face card-front">
          <header className="card-header">
            <span>{card.number}</span>
            <span>{card.position}</span>
          </header>
          <Sigil seed={card.sigilSeed} />
          <div className="card-title-block">
            <p>{card.planet} · {card.element}</p>
            <h3>{card.name}</h3>
            <div className="card-meta">
              <span>{card.polarity}</span>
              <span aria-label={`Intensité ${card.intensity} sur 5`}>{"◆".repeat(card.intensity)}{"◇".repeat(5 - card.intensity)}</span>
            </div>
          </div>
          <blockquote>{card.oracle}</blockquote>
          <p className="interpretation">{card.interpretation}</p>
          <div className="card-action">
            <span>Protocole</span>
            <p>{card.action}</p>
          </div>
          <button className={`lock-button ${locked ? "is-locked" : ""}`} onClick={onToggleLock} aria-pressed={locked} aria-label={`${locked ? "Déverrouiller" : "Verrouiller"} ${card.name}`}>
            {locked ? <Lock size={15} aria-hidden /> : <LockOpen size={15} aria-hidden />}
            {locked ? "Scellée" : "Verrouiller"}
          </button>
        </div>
      </motion.div>
    </article>
  );
}

