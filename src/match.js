import { ROLE, VALUES, LANG, KANTONE, shareOf } from "./data.js";

// Wie gut passen zwei Rollen zusammen? (max. 30 Punkte)
const ROLE_FIT = {
  mutter: { vater: 30, bezug: 24, mutter: 18 },
  vater: { mutter: 30, bezug: 20, vater: 16 },
  bezug: { mutter: 30, vater: 30, bezug: 0 },
};

// Berechnet die Übereinstimmung (0–100 %) und die Gründe dafür
export function matchOf(me, p) {
  const why = [];
  const mine = shareOf(me.split, me.side);
  const theirs = shareOf(p.split, p.side);

  const rf = ROLE_FIT[me.role]?.[p.role] ?? 10;
  if (rf >= 24) why.push(`Eure Rollen ergänzen sich (${ROLE[me.role]} & ${ROLE[p.role]})`);
  const rs = (rf * 25) / 30;

  const diff = Math.abs(mine + theirs - 100);
  const ss = 30 * Math.max(0, 1 - diff / 50);
  why.push(diff <= 10
    ? `Betreuung passt: ${mine}% + ${theirs}% ≈ 100%`
    : `Betreuung weicht ab: ${mine}% + ${theirs}% = ${mine + theirs}%`);

  let gs = 5;
  if (me.canton === p.canton) { gs = 20; why.push(`Gleicher Kanton (${KANTONE[p.canton]})`); }
  else if (LANG[me.canton] === LANG[p.canton]) { gs = 12; why.push("Gleiche Sprachregion"); }

  const ms = (mine === 50) === (theirs === 50) ? 5 : 1;

  const keys = Object.keys(VALUES).filter(k => me[k] && p[k]);
  const same = keys.filter(k => me[k] === p[k] || me[k] === "Offen" || p[k] === "Offen");
  const vs = keys.length ? (same.length / 4) * 20 : 10;
  if (same.length >= 3) why.push("Ähnliche Werte: " + same.map(k => VALUES[k]).join(", "));
  else if (keys.length && same.length <= 1) why.push("Bei Werten & Erziehung gibt es Unterschiede – gut darüber reden");

  if (me.kids !== "keine" && p.kids !== "keine") why.push("Ihr habt beide schon Kinder – Patchwork-Erfahrung");

  return { score: Math.min(100, Math.round(rs + ss + gs + ms + vs)), why };
}
