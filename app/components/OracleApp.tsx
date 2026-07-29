"use client";

import { AnimatePresence, motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Archive, Check, Clipboard, Copy, Download, History, LockKeyhole, Menu, Orbit, RefreshCw, Save, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createSeed, generateReading } from "../lib/engine";
import { loadReadings, persistReadings, upsertReading } from "../lib/storage";
import { MODES, type OracleMode, type OracleReading } from "../lib/types";
import { OracleCard } from "./OracleCard";

const SCORE_LABELS: Array<[keyof OracleReading["scores"], string]> = [
  ["tension", "Tension"], ["expansion", "Expansion"], ["stability", "Stabilité"], ["mutation", "Mutation"],
];

function readingToText(reading: OracleReading): string {
  const cards = reading.cards.map((card) =>
    `${card.position.toUpperCase()} — ${card.name}\n${card.planet} · ${card.element} · ${card.polarity} · Intensité ${card.intensity}/5\n« ${card.oracle} »\nInterprétation : ${card.interpretation}\nAction : ${card.action}`,
  ).join("\n\n");
  return `KYBER ORACLE\n${reading.mode}${reading.question ? `\nQuestion : ${reading.question}` : ""}\nSeed : ${reading.seed}\n\n${cards}\n\nSYNTHÈSE\n${reading.synthesis}\n\nScores — Tension ${reading.scores.tension} · Expansion ${reading.scores.expansion} · Stabilité ${reading.scores.stability} · Mutation ${reading.scores.mutation}`;
}

export function OracleApp() {
  const [mode, setMode] = useState<OracleMode>("Oracle du jour");
  const [question, setQuestion] = useState("");
  const [seedInput, setSeedInput] = useState("");
  const [reading, setReading] = useState<OracleReading | null>(null);
  const [revealed, setRevealed] = useState([false, false, false]);
  const [locked, setLocked] = useState([false, false, false]);
  const [history, setHistory] = useState<OracleReading[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [ritualPulse, setRitualPulse] = useState(0);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try { setHistory(loadReadings()); }
      catch { setError("L’archive locale est indisponible dans ce navigateur."); }
    });
  }, []);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  };

  const draw = (reuseLocks = false) => {
    setError("");
    try {
      const seed = seedInput.trim() || createSeed(mode, question);
      const kept = reuseLocks && reading
        ? reading.cards.map((card, index) => locked[index] ? card : null)
        : [null, null, null];
      const next = generateReading(seed, mode, question, kept);
      setReading(next);
      setSeedInput(next.seed);
      setRevealed(reuseLocks ? revealed.map((value, index) => locked[index] ? value : false) : [false, false, false]);
      if (!reuseLocks) setLocked([false, false, false]);
      setRitualPulse((value) => value + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le tirage n’a pas pu être généré.");
    }
  };

  const updateArchive = (next: OracleReading[]) => {
    setHistory(next);
    try { persistReadings(next); }
    catch { setError("Le navigateur refuse l’écriture dans l’archive locale."); }
  };

  const save = () => {
    if (!reading) return;
    updateArchive(upsertReading(history, reading));
    flash("Tirage scellé dans l’archive");
  };

  const restore = (item: OracleReading) => {
    setReading(item); setMode(item.mode); setQuestion(item.question); setSeedInput(item.seed);
    setRevealed([true, true, true]); setLocked([false, false, false]); setHistoryOpen(false);
    flash("Tirage restauré");
  };

  const copyText = async (text: string, message: string) => {
    try { await navigator.clipboard.writeText(text); flash(message); }
    catch { setError("La copie est bloquée. Autorisez l’accès au presse-papiers puis réessayez."); }
  };

  const exportPng = async () => {
    if (!reading || !exportRef.current) return;
    setError("");
    try {
      const dataUrl = await toPng(exportRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor: "#070b12" });
      const link = document.createElement("a");
      link.download = `kyber-oracle-${reading.seed.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      flash("Image PNG générée");
    } catch {
      setError("L’export PNG a échoué. Réduisez le zoom ou réessayez dans un autre navigateur.");
    }
  };

  const clearArchive = () => {
    if (history.length && window.confirm("Effacer définitivement tous les tirages sauvegardés sur cet appareil ?")) {
      updateArchive([]); flash("Archive effacée");
    }
  };

  return (
    <main className="app-shell">
      <div className="ambient-grid" aria-hidden />
      <div className={`ritual-flare pulse-${ritualPulse % 2}`} aria-hidden />
      <header className="topbar">
        <a href="#oracle" className="brand" aria-label="KYBER ORACLE, accueil">
          <span className="brand-mark"><Orbit size={20} aria-hidden /></span>
          <span><b>KYBER</b> ORACLE</span>
        </a>
        <div className="system-status"><span /> Système local · aucune transmission</div>
        <button className="history-trigger" onClick={() => setHistoryOpen(true)} aria-label="Ouvrir l’historique">
          <History size={17} aria-hidden /><span>Archives</span><b>{String(history.length).padStart(2, "0")}</b>
        </button>
      </header>

      <section className="hero" id="oracle">
        <div className="eyebrow"><span>PROTOCOLE DIVINATOIRE</span><i /></div>
        <h1>Interrogez la<br /><em>machine symbolique.</em></h1>
        <p className="hero-copy">Trois archétypes émergent d’une seed reproductible. Le calcul reste sur cet appareil ; l’interprétation vous appartient.</p>
      </section>

      <section className="control-deck" aria-label="Paramètres du tirage">
        <div className="mode-rail" role="radiogroup" aria-label="Mode oracle">
          {MODES.map((item, index) => (
            <button key={item} role="radio" aria-checked={mode === item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>
              <span>0{index + 1}</span>{item}
            </button>
          ))}
        </div>
        <div className="query-grid">
          <label>
            <span>Question facultative</span>
            <textarea value={question} onChange={(event) => setQuestion(event.target.value.slice(0, 240))} placeholder="Quelle force agit sous la surface de ce projet ?" rows={2} />
            <small>{question.length}/240</small>
          </label>
          <label>
            <span>Seed de résonance</span>
            <div className="seed-field">
              <input value={seedInput} onChange={(event) => setSeedInput(event.target.value)} placeholder="Générée automatiquement" maxLength={64} spellCheck={false} />
              {reading && <button onClick={() => copyText(reading.seed, "Seed copiée")} aria-label="Copier la seed"><Copy size={16} aria-hidden /></button>}
            </div>
            <small>Identique = tirage identique</small>
          </label>
          <button className="draw-button" onClick={() => draw(false)}>
            <Sparkles size={19} aria-hidden /><span>{reading ? "Nouveau tirage" : "Ouvrir le tirage"}</span><kbd>↵</kbd>
          </button>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {reading ? (
          <motion.section key={reading.id} ref={exportRef} className="reading" initial={{ opacity: 0, y: 18, filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} aria-live="polite">
            <div className="reading-header">
              <div><span>TIRAGE / {reading.seed}</span><h2>Triptyque de résonance</h2></div>
              <div className="reading-tools" aria-label="Actions du tirage">
                <button onClick={() => setRevealed([true, true, true])}><Menu size={16} aria-hidden /> Tout révéler</button>
                <button onClick={() => draw(true)} disabled={!locked.some(Boolean)}><RefreshCw size={16} aria-hidden /> Relancer libres</button>
              </div>
            </div>
            <div className="cards-grid">
              {reading.cards.map((card, index) => (
                <OracleCard key={`${card.archetypeId}-${index}`} card={card} index={index} revealed={revealed[index]} locked={locked[index]}
                  onReveal={() => setRevealed((current) => current.map((value, i) => i === index ? true : value))}
                  onToggleLock={() => setLocked((current) => current.map((value, i) => i === index ? !value : value))} />
              ))}
            </div>
            <section className="synthesis">
              <div className="synthesis-copy">
                <span>SYNTHÈSE DU SYSTÈME</span><p>{reading.synthesis}</p>
                <div className="question-echo">{reading.question || "Question ouverte — lecture sans contrainte thématique"}</div>
              </div>
              <div className="score-matrix">
                {SCORE_LABELS.map(([key, label]) => (
                  <div key={key}><span>{label}</span><b>{reading.scores[key]}</b><div><i style={{ width: `${reading.scores[key]}%` }} /></div></div>
                ))}
              </div>
            </section>
            <nav className="action-dock" aria-label="Exporter ou sauvegarder le tirage">
              <button onClick={() => copyText(readingToText(reading), "Lecture copiée")}><Clipboard size={17} aria-hidden /> Copier</button>
              <button onClick={save}><Save size={17} aria-hidden /> Sauvegarder</button>
              <button onClick={exportPng}><Download size={17} aria-hidden /> Exporter PNG</button>
              <button className="seed-chip" onClick={() => copyText(reading.seed, "Seed copiée")}><LockKeyhole size={14} aria-hidden /> {reading.seed}</button>
            </nav>
          </motion.section>
        ) : (
          <motion.section className="sealed-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="sealed-disc" aria-hidden><Orbit /><span /></div>
            <p>Le champ symbolique est silencieux.</p>
            <span>Choisissez un mode, formulez si besoin une question, puis ouvrez le tirage.</span>
          </motion.section>
        )}
      </AnimatePresence>

      <footer><span>KYBER ORACLE / MOTEUR SYMBOLIQUE v1.0</span><span>LOCAL-FIRST · DÉTERMINISTE · SANS COMPTE</span></footer>

      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.button className="drawer-scrim" aria-label="Fermer l’historique" onClick={() => setHistoryOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="history-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 240, damping: 28 }} aria-label="Historique des tirages">
              <header><div><Archive size={18} aria-hidden /><span>Archives locales</span></div><button onClick={() => setHistoryOpen(false)} aria-label="Fermer"><X size={20} /></button></header>
              <p className="archive-note">Les tirages sont conservés uniquement dans ce navigateur.</p>
              <div className="archive-list">
                {history.length === 0 ? <div className="empty-archive"><Archive size={30} aria-hidden /><p>Aucun tirage scellé.</p></div> : history.map((item) => (
                  <article key={item.id}>
                    <button className="archive-main" onClick={() => restore(item)}>
                      <span>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</span>
                      <b>{item.mode}</b>{item.question && <em>« {item.question} »</em>}
                      <p>{item.cards.map((card) => card.name).join(" · ")}</p><code>{item.seed}</code>
                    </button>
                    <button className="delete-entry" onClick={() => updateArchive(history.filter((readingItem) => readingItem.id !== item.id))} aria-label={`Supprimer le tirage ${item.seed}`}><Trash2 size={16} /></button>
                  </article>
                ))}
              </div>
              {history.length > 0 && <button className="clear-archive" onClick={clearArchive}><Trash2 size={16} aria-hidden /> Vider toute l’archive</button>}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(notice || error) && <motion.div className={`toast ${error ? "error" : ""}`} role={error ? "alert" : "status"} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {error ? <X size={16} aria-hidden /> : <Check size={16} aria-hidden />}<span>{error || notice}</span>
          {error && <button onClick={() => setError("")} aria-label="Fermer"><X size={14} /></button>}
        </motion.div>}
      </AnimatePresence>
    </main>
  );
}
