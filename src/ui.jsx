import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { SPLITS } from "./data.js";

/* Illustration als Bild-Platzhalter. Später durch echte Fotos ersetzen. */
export function Scene({ v = 0, style }) {
  const pal = [
    ["#E6D3BA", "#F5EDE1", "#B8916C"], ["#EBD9C4", "#F7F0E6", "#C49A78"],
    ["#DCC6A9", "#F2E8DA", "#A47E5C"], ["#E8D8C2", "#F6EFE4", "#B39373"],
    ["#E2CDB2", "#F4EADC", "#9C7A5B"], ["#EAD6BF", "#F8F1E7", "#BC9672"],
  ][Math.abs(v) % 6];
  const id = "g" + useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block", ...style }} aria-hidden="true">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={pal[1]} /><stop offset="1" stopColor={pal[0]} /></linearGradient></defs>
      <rect width="400" height="500" fill={`url(#${id})`} />
      <circle cx={v % 2 ? 110 : 290} cy="130" r="54" fill="#FFF8EC" opacity=".75" />
      <path d="M0 330 L70 250 L120 290 L200 190 L270 270 L320 230 L400 300 L400 500 L0 500Z" fill={pal[2]} opacity=".35" />
      <path d="M0 380 L90 310 L170 360 L260 290 L340 345 L400 320 L400 500 L0 500Z" fill={pal[2]} opacity=".55" />
      <path d="M0 430 Q200 390 400 430 L400 500 L0 500Z" fill={pal[2]} opacity=".8" />
      <g fill="#3A3029" opacity=".78" transform={`translate(${v % 2 ? 150 : 130} 300)`}>
        <circle cx="20" cy="0" r="11" /><path d="M6 16 Q20 10 34 16 L36 78 L4 78Z" />
        <circle cx="100" cy="4" r="11" /><path d="M86 20 Q100 14 114 20 L116 78 L84 78Z" />
        <circle cx="60" cy="38" r="8" /><path d="M50 50 Q60 46 70 50 L72 82 L48 82Z" />
        <path d="M34 34 Q46 46 52 54" stroke="#3A3029" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M86 36 Q74 46 68 54" stroke="#3A3029" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Zahl aus einer ID, damit jedes Mitglied immer dieselbe Farbe bekommt
export const hashV = (s = "") => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);

export function Avatar({ name = "", id = "", size = 48 }) {
  return (
    <div className="av" style={{ width: size, height: size, position: "relative" }}>
      <Scene v={hashV(id)} />
      <span className="av-i" style={{ fontSize: size * 0.38 }}>{name.slice(0, 1).toUpperCase()}</span>
    </div>
  );
}

const s = { fill: "none", stroke: "currentColor" };
export const I = {
  check: <svg width="18" height="18" viewBox="0 0 24 24" {...s} strokeWidth="1.8"><path d="M20 6 9 17l-5-5" /></svg>,
  shield: <svg width="22" height="22" viewBox="0 0 24 24" {...s} strokeWidth="1.6"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /></svg>,
  heart: <svg width="22" height="22" viewBox="0 0 24 24" {...s} strokeWidth="1.6"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>,
  home: <svg width="22" height="22" viewBox="0 0 24 24" {...s} strokeWidth="1.6"><path d="M3 11 12 4l9 7v9H3z" /><path d="M9 20v-6h6v6" /></svg>,
  users: <svg width="22" height="22" viewBox="0 0 24 24" {...s} strokeWidth="1.6"><circle cx="9" cy="8" r="3.5" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c3 0 6 2 6 5.5" /></svg>,
  menu: <svg width="20" height="20" viewBox="0 0 24 24" {...s} strokeWidth="1.6"><path d="M4 8h16M4 16h16" /></svg>,
  close: <svg width="20" height="20" viewBox="0 0 24 24" {...s} strokeWidth="1.6"><path d="M6 6l12 12M18 6 6 18" /></svg>,
  chat: <svg width="20" height="20" viewBox="0 0 24 24" {...s} strokeWidth="1.6"><path d="M4 5h16v11H9l-5 4z" /></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" {...s} strokeWidth="1.6"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>,
  video: <svg width="20" height="20" viewBox="0 0 24 24" {...s} strokeWidth="1.6"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></svg>,
  dots: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>,
  back: <svg width="20" height="20" viewBox="0 0 24 24" {...s} strokeWidth="1.6"><path d="M15 5l-7 7 7 7" /></svg>,
  send: <svg width="20" height="20" viewBox="0 0 24 24" {...s} strokeWidth="1.8"><path d="M4 12 20 4l-6 16-3-7z" /></svg>,
  info: <svg width="18" height="18" viewBox="0 0 24 24" {...s} strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></svg>,
};
export const Arr = () => <span className="arr">→</span>;

export const BtnLink = ({ to, children, ghost, ...p }) =>
  <Link to={to} className={"btn " + (ghost ? "btn-g" : "btn-p")} {...p}>{children}</Link>;

export const Share = ({ v }) => (
  <div style={{ marginTop: 6 }}>
    <div style={{ height: 8, borderRadius: 8, background: "var(--sand)", overflow: "hidden" }}>
      <div style={{ width: v + "%", height: "100%", background: "var(--sage-d)", borderRadius: 8 }} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 6 }}>
      <span>Eigener Anteil: {v}%</span><span>Co-Elternteil: {100 - v}%</span>
    </div>
  </div>
);

export function Spectrum() {
  const sub = ["Kontakt & Bezugsperson", "Regelmässige Zeit", "Ein Hauptzuhause", "Leicht ungleich", "Beide gleich viel"];
  const [i, setI] = useState(2);
  return (
    <div className="spec">
      <div className="spec-hd">
        <div><span className="eyebrow">Alles dazwischen</span>
          <h3 style={{ marginTop: 8 }}>Zwischen Nach Mass und Halb-halb gibt es <em className="s">viele Wege.</em></h3></div>
        <p>Tippe eine Stufe an. Im Profil gibst du an, welche Aufteilung du dir vorstellen kannst.</p>
      </div>
      <div className="spec-bar">
        <div className="spec-fill" style={{ width: (i / 4) * 100 + "%" }} />
        {SPLITS.map((x, k) => <button key={k} className={"spec-dot" + (k <= i ? " on" : "")} style={{ left: (k / 4) * 100 + "%" }} onClick={() => setI(k)} aria-label={x.l} />)}
      </div>
      <div className="spec-lb">
        {SPLITS.map((x, k) => <button key={k} onClick={() => setI(k)} className={k === i ? "on" : ""}><b>{x.l}</b><span>{sub[k]}</span></button>)}
      </div>
      <div className="spec-ends"><span>← Nach Mass</span><span>Halb-halb →</span></div>
    </div>
  );
}

export function Steps() {
  const S = [
    ["Profil erstellen", "Erzähle von dir, deinen Werten und deiner Vorstellung von Familie."],
    ["Modell wählen", "Halb-halb oder Nach Mass – du legst fest, was zu dir passt."],
    ["Kennenlernen", "Sende eine Kontaktanfrage. Nach einer Zusage könnt ihr euch schreiben."],
    ["Gemeinsam planen", "Haltet eure Vereinbarungen fest – mit Leitfäden und Fachberatung."],
  ];
  return <div className="steps">{S.map(([t, d], i) => <div className="step" key={i}><div className="n">0{i + 1}</div><h4>{t}</h4><p>{d}</p></div>)}</div>;
}

export function Modal({ onClose, children, className = "" }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className={"modal " + className} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

export const Note = ({ children, style }) => <div className="note" style={style}>{I.info}<span>{children}</span></div>;
export const Err = ({ children }) => children ? <div className="err">{children}</div> : null;

// Supabase-Fehlermeldungen auf Deutsch
export function deErr(e) {
  const m = (e?.message || String(e || "")).toLowerCase();
  if (m.includes("invalid login")) return "E-Mail oder Passwort ist falsch.";
  if (m.includes("email not confirmed")) return "Bitte bestätige zuerst deine E-Mail-Adresse (Link im Postfach).";
  if (m.includes("already registered")) return "Mit dieser E-Mail-Adresse gibt es bereits ein Konto.";
  if (m.includes("password should be")) return "Das Passwort muss mindestens 8 Zeichen lang sein.";
  if (m.includes("rate limit")) return "Zu viele Versuche. Bitte warte ein paar Minuten.";
  if (m.includes("18 jahre")) return "Mitglieder müssen mindestens 18 Jahre alt sein.";
  if (m.includes("duplicate key")) return "Das wurde bereits gesendet.";
  if (m.includes("row-level security")) return "Das ist leider nicht erlaubt.";
  return e?.message || "Etwas ist schiefgelaufen. Bitte versuche es erneut.";
}
