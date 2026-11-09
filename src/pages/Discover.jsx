import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useAuth } from "../auth.jsx";
import { ROLE, CONSTELLATION, MODEL, KIDS, KANTONE, VALUES, age, shareOf } from "../data.js";
import { matchOf } from "../match.js";
import { Scene, hashV, Arr, BtnLink, Share, Modal, Note, Err, deErr, I } from "../ui.jsx";
import { SafetyDialog } from "../safety.jsx";

function Gate({ title, text, to, cta }) {
  return (
    <div className="page">
      <div className="wrap ph">
        <span className="eyebrow">Co-Parenting entdecken</span>
        <h1>Menschen, die <em className="s">zu dir passen.</em></h1>
        <p className="lead">Wir zeigen dir zuerst die Profile mit der grössten Übereinstimmung – nach Rolle, Betreuungsanteil, Region und Werten.</p>
      </div>
      <div className="wrap">
        <div className="cta" style={{ marginBottom: 40 }}>
          <h2>{title}</h2><p>{text}</p>
          <BtnLink to={to}>{cta} <Arr /></BtnLink>
        </div>
      </div>
    </div>
  );
}

export function Discover() {
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const [list, setList] = useState(null);
  const [reqs, setReqs] = useState([]);
  const [err, setErr] = useState("");
  const [r, setR] = useState("alle");
  const [kidsOnly, setKidsOnly] = useState(false);
  const [sel, setSel] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    const [p, q] = await Promise.all([
      supabase.from("profiles").select("*").eq("is_complete", true).neq("id", user.id).limit(500),
      supabase.from("contact_requests").select("*").or(`from_id.eq.${user.id},to_id.eq.${user.id}`),
    ]);
    if (p.error) setErr(deErr(p.error));
    setList(p.data || []);
    setReqs(q.data || []);
  }, [user]);
  useEffect(() => { load(); }, [load]);

  const scored = useMemo(() => !list || !profile ? [] : list
    .map(p => ({ ...p, ...matchOf(profile, p) }))
    .filter(p => (r === "alle" || p.role === r) && (!kidsOnly || p.kids !== "keine"))
    .sort((a, b) => b.score - a.score), [list, profile, r, kidsOnly]);

  if (!user) return <Gate title="Profile sind nur für Mitglieder sichtbar." text="So bleibt Nid Commun ein geschützter Ort. Erstelle kostenlos ein Konto, um passende Menschen zu entdecken." to="/anmelden" cta="Kostenlos registrieren" />;
  if (!profile?.is_complete) return <Gate title="Fast geschafft!" text="Erstelle zuerst dein Profil. Dann können wir dir passende Vorschläge zeigen." to="/profil" cta="Profil erstellen" />;

  const reqWith = id => reqs.find(x => x.from_id === id || x.to_id === id);

  return (
    <div className="page">
      <div className="wrap ph">
        <span className="eyebrow">Co-Parenting entdecken</span>
        <h1>Menschen, die <em className="s">zu dir passen.</em></h1>
        <p className="lead">Sortiert nach Übereinstimmung mit deinem Profil. Deine Angaben änderst du unter «Mein Profil».</p>
      </div>
      <div className="wrap" style={{ paddingBottom: 20 }}>
        <div className="how3">
          <div><b>1</b> Vorschläge ansehen</div>
          <div><b>2</b> Kontaktanfrage senden</div>
          <div><b>3</b> Nach Zusage schreiben</div>
        </div>
        <div className="filters">
          <span style={{ fontSize: 14, color: "var(--muted)", alignSelf: "center", marginRight: 4 }}>Zeige:</span>
          {[["alle", "Alle Rollen"], ...Object.entries(ROLE)].map(([k, l]) =>
            <button key={k} className={"chip" + (r === k ? " on" : "")} onClick={() => setR(k)}>{l}</button>)}
          <button className={"chip" + (kidsOnly ? " on" : "")} onClick={() => setKidsOnly(!kidsOnly)}>Mit Kindern / Patchwork</button>
        </div>
        <Err>{err}</Err>
        {list === null ? <p className="small">Profile werden geladen …</p> : (
          <div className="grid3">
            {scored.map(p => {
              const q = reqWith(p.id);
              return (
                <button className="pc" key={p.id} onClick={() => setSel(p)}>
                  <div className="img"><Scene v={hashV(p.id)} /><span className="badge">{MODEL[p.model]}</span>
                    <span className={"mbadge" + (p.score >= 75 ? " hi" : "")}>{p.score}% Übereinstimmung</span></div>
                  <div className="bd">
                    <h3>{p.first_name}</h3>
                    <div className="meta">{ROLE[p.role]}{p.constellation && p.constellation !== "einzeln" ? " · " + CONSTELLATION[p.constellation] : ""} · {age(p.birth_year)} · {p.city || KANTONE[p.canton]}</div>
                    <p>{p.about ? (p.about.length > 160 ? p.about.slice(0, 160) + " …" : p.about) : "Noch keine Beschreibung."}</p>
                    <div className="tags">
                      {q && <span className="tag st">{q.status === "accepted" ? "✓ Kontakt" : q.to_id === user.id && q.status === "pending" ? "Hat dich angefragt" : "Anfrage gesendet"}</span>}
                      {p.kids !== "keine" && <span className="tag kid">Hat bereits Kinder</span>}
                      <span className="tag">{KANTONE[p.canton]}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {list && scored.length === 0 && (
          <Note>Noch keine passenden Profile. Nid Commun ist neu – schau bald wieder vorbei oder erzähle Freundinnen und Freunden davon.</Note>
        )}
      </div>
      {sel && <ProfileModal p={sel} me={user.id} req={reqWith(sel.id)} onClose={() => setSel(null)} onChange={load}
        onChat={() => nav("/nachrichten?mit=" + sel.id)} />}
    </div>
  );
}

function ProfileModal({ p, me, req, onClose, onChange, onChat }) {
  const [sens, setSens] = useState(null);
  const [writing, setWriting] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [safety, setSafety] = useState(null);

  useEffect(() => {
    supabase.from("profile_sensitive").select("gender,orientation,religion").eq("user_id", p.id).maybeSingle()
      .then(({ data }) => setSens(data));
  }, [p.id, req?.status]);

  const send = async () => {
    setBusy(true); setErr("");
    const { error } = await supabase.from("contact_requests").insert({ from_id: me, to_id: p.id, message: msg.trim() || null });
    setBusy(false);
    if (error) return setErr(deErr(error));
    setWriting(false); onChange();
  };
  const answer = async ok => {
    setBusy(true); setErr("");
    const { error } = await supabase.from("contact_requests").update({ status: ok ? "accepted" : "declined", responded_at: new Date().toISOString() }).eq("id", req.id);
    setBusy(false);
    if (error) return setErr(deErr(error));
    onChange();
  };

  const incoming = req && req.to_id === me;
  const first = p.first_name;

  return (
    <Modal onClose={onClose}>
      <div className="img" style={{ position: "relative" }}><Scene v={hashV(p.id)} />
        <span className={"mbadge" + (p.score >= 75 ? " hi" : "")}>{p.score}% Übereinstimmung</span>
        <button className="x" onClick={onClose} aria-label="Schliessen">{I.close}</button></div>
      <div className="bd">
        <h3>{first}</h3>
        <div className="meta">{ROLE[p.role]} · {age(p.birth_year)} · {p.city ? p.city + ", " : ""}{KANTONE[p.canton]}</div>
        {p.about && <p style={{ color: "var(--muted)", whiteSpace: "pre-line" }}>{p.about}</p>}

        <div className="why"><b>Warum ihr passen könntet</b><ul>{p.why.map(w => <li key={w}>{w}</li>)}</ul></div>

        <div className="kv">
          <div><small>Konstellation</small>{CONSTELLATION[p.constellation] || "Einzelperson"}</div>
          <div><small>Familienmodell</small>{MODEL[p.model]}</div>
          <div style={{ gridColumn: "1 / -1" }}><small>Bereits Kinder</small>{KIDS[p.kids]}</div>
          <div style={{ gridColumn: "1 / -1" }}><small>Gewünschter eigener Betreuungsanteil</small><Share v={shareOf(p.split, p.side)} /></div>
        </div>
        {sens && (sens.gender || sens.orientation || sens.religion) && <>
          <h4 className="sec">Über mich</h4>
          <div className="kv">
            {sens.gender && <div><small>Geschlecht</small>{sens.gender}</div>}
            {sens.orientation && <div><small>Orientierung</small>{sens.orientation}</div>}
            {sens.religion && <div><small>Religion</small>{sens.religion}</div>}
          </div>
        </>}
        {(p.job || p.workload || p.housing || p.languages) && <>
          <h4 className="sec">Lebenssituation</h4>
          <div className="kv">
            {p.job && <div><small>Beruf</small>{p.job}</div>}
            {p.workload && <div><small>Arbeitspensum</small>{p.workload}</div>}
            {p.housing && <div><small>Wohnsituation</small>{p.housing}</div>}
            {p.languages && <div><small>Sprachen</small>{p.languages}</div>}
          </div>
        </>}
        {Object.keys(VALUES).some(k => p[k]) && <>
          <h4 className="sec">Werte & Erziehung</h4>
          <div className="kv">{Object.entries(VALUES).filter(([k]) => p[k]).map(([k, l]) => <div key={k}><small>{l}</small>{p[k]}</div>)}</div>
        </>}

        <Err>{err}</Err>
        {!req && !writing && <button className="btn btn-p full" onClick={() => setWriting(true)}>Kontaktanfrage senden <Arr /></button>}
        {!req && writing && (
          <div>
            <label className="f">Kurze Vorstellung (optional)
              <textarea rows="4" maxLength={1000} value={msg} onChange={e => setMsg(e.target.value)} placeholder={`Hallo ${first}, ich habe dein Profil gelesen und …`} /></label>
            <p className="small">{first} sieht deine Anfrage und dein Profil. Erst nach einer Zusage könnt ihr euch schreiben.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-g" style={{ flex: 1, justifyContent: "center" }} onClick={() => setWriting(false)}>Abbrechen</button>
              <button className="btn btn-p" style={{ flex: 2, justifyContent: "center" }} disabled={busy} onClick={send}>Anfrage senden</button>
            </div>
          </div>
        )}
        {req && !incoming && req.status !== "accepted" && <div className="ok">Anfrage gesendet. Sobald {first} zusagt, findest du das Gespräch unter «Nachrichten».</div>}
        {req && incoming && req.status === "pending" && <>
          <div className="ok" style={{ marginBottom: 12 }}>{first} hat dir eine Kontaktanfrage geschickt{req.message ? <>: <i>«{req.message}»</i></> : "."}</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-g" style={{ flex: 1, justifyContent: "center" }} disabled={busy} onClick={() => answer(false)}>Ablehnen</button>
            <button className="btn btn-p" style={{ flex: 2, justifyContent: "center" }} disabled={busy} onClick={() => answer(true)}>Annehmen</button>
          </div>
        </>}
        {req && incoming && req.status === "declined" && <div className="ok">Du hast diese Anfrage abgelehnt.</div>}
        {req?.status === "accepted" && <button className="btn btn-p full" onClick={onChat}>Nachricht schreiben <Arr /></button>}

        <p className="small" style={{ marginTop: 18, textAlign: "center" }}>
          <a href="#" onClick={e => { e.preventDefault(); setSafety("report"); }}>Melden</a> · <a href="#" onClick={e => { e.preventDefault(); setSafety("block"); }}>Blockieren</a>
        </p>
      </div>
      {safety && <SafetyDialog mode={safety} me={me} other={p} onClose={() => setSafety(null)} onBlocked={() => { onClose(); onChange(); }} />}
    </Modal>
  );
}
