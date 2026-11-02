// Feste Auswahllisten und Texte für Co-Nest

export const ROLE = { mutter: "Mutter", vater: "Vater", bezug: "Begleitende Bezugsperson" };
export const ROLE_LONG = { ...ROLE, bezug: "Begleitende Bezugsperson (ähnlich wie Gotte / Götti)" };
export const MODEL = { gleich: "Halb-halb", flex: "Nach Mass", offen: "Noch offen" };
export const KIDS = { keine: "Noch keine Kinder", eins: "1 Kind", mehrere: "2 oder mehr Kinder" };

export const SPLITS = [
  { big: 95, l: "Begleitende Rolle" },
  { big: 85, l: "Wochenende & Ferien" },
  { big: 70, l: "70 / 30" },
  { big: 60, l: "60 / 40" },
  { big: 50, l: "50 / 50" },
];
export const shareOf = (split, side) => {
  const big = SPLITS[split ?? 4].big;
  return big === 50 ? 50 : side === "klein" ? 100 - big : big;
};

export const KANTONE = {
  AG: "Aargau", AI: "Appenzell Innerrhoden", AR: "Appenzell Ausserrhoden", BE: "Bern",
  BL: "Basel-Landschaft", BS: "Basel-Stadt", FR: "Freiburg", GE: "Genf", GL: "Glarus",
  GR: "Graubünden", JU: "Jura", LU: "Luzern", NE: "Neuenburg", NW: "Nidwalden",
  OW: "Obwalden", SG: "St. Gallen", SH: "Schaffhausen", SO: "Solothurn", SZ: "Schwyz",
  TG: "Thurgau", TI: "Tessin", UR: "Uri", VD: "Waadt", VS: "Wallis", ZG: "Zug", ZH: "Zürich",
};
// Sprachregion je Kanton (vereinfacht)
export const LANG = Object.fromEntries(Object.keys(KANTONE).map(k => [k,
  ["GE", "VD", "NE", "JU", "FR", "VS"].includes(k) ? "fr" : k === "TI" ? "it" : "de"]));

export const OPT = {
  gender: ["Frau", "Mann", "Nonbinär", "Keine Angabe"],
  orientation: ["Heterosexuell", "Lesbisch", "Schwul", "Bisexuell", "Queer / andere", "Keine Angabe"],
  religion: ["Konfessionslos", "Reformiert", "Katholisch", "Muslimisch", "Jüdisch", "Andere", "Keine Angabe"],
  rel_edu: ["Wichtig", "Offen", "Nicht wichtig"],
  diet: ["Alles", "Vegetarisch", "Vegan", "Andere"],
  school: ["Volksschule", "Privatschule", "Montessori / Steiner", "Offen"],
  media: ["Zurückhaltend", "Ausgewogen", "Locker"],
  workload: ["Bis 50 %", "60–80 %", "90–100 %"],
  housing: ["Wohnung", "Haus mit Garten", "WG", "Andere"],
};
export const VALUES = { rel_edu: "Religion in der Erziehung", diet: "Ernährung", school: "Schulwahl", media: "Umgang mit Medien" };
export const VISIBILITY = {
  contacts: "Erst nach angenommener Kontaktanfrage",
  members: "Alle angemeldeten Mitglieder",
  private: "Nur für mich",
};

export const REPORT_REASONS = [
  "Fake-Profil oder falsche Angaben",
  "Belästigung oder Druck",
  "Unangemessene Inhalte",
  "Geld- oder Geschäftsabsichten",
  "Anderes",
];

export const age = y => (y ? new Date().getFullYear() - y : "");
