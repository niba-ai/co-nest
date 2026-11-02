import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useAuth } from "../auth.jsx";
import { ROLE_LONG, MODEL, KIDS, KANTONE, OPT, VALUES, SPLITS, VISIBILITY } from "../data.js";
import { Err, deErr, Modal, Note } from "../ui.jsx";

const STEPS = ["Über mich", "Lebenssituation", "Werte & Erziehung", "Familie"];
const EMPTY = {
  first_name: "", birth_year: "", canton: "", city: "", role: "mutter", kids: "keine",
  job: "", workload: "", housing: "", languages: "",
  rel_edu: "", diet: "", school: "", media: "",
  model: "offen", split: 4, side: "gross", about: "",
};
const EMPTY_S = { gender: "", orientation: "", religion: "", visibility: "contacts" };

const Sel = ({ label, value, onChange, opts, hint, required }) => (
  <label className="f">{label}{hint && <span className="opt"> {hint}</span>}
    <select value={value || ""} onChange={e => onChange(e.target.value)} required={required}>
      <option value="">Bitte wählen</option>
      {Array.isArray(opts) ? opts.map(o => <option key={o} value={o}>{o}</option>)
        : Object.entries(opts).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
    </select>
  </label>
);

export function ProfilePage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const nav = useNavigate();
  const editing = Boolean(profile?.is_complete);
  const [f, setF] = useState(EMPTY);
  const [sv, setSv] = useState(EMPTY_S);
  const [st, setSt] = useState(0);
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [del, setDel] = useState(false);

  useEffect(() => {
    if (profile) setF({ ...EMPTY, ...Object.fromEntries(Object.entries(profile).map(([k, v]) => [k, v ?? ""])) });
    if (user) supabase.from("profile_sensitive").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => data && setSv({ ...EMPTY_S, ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ""])) }));
  }, [profile, user]);

  const up = (k, v) => { setF(x => ({ ...x, [k]: v })); setSaved(false); };
  const upS = (k, v) => { setSv(x => ({ ...x, [k]: v })); setSaved(false); };
  const last = st === STEPS.length - 1;

  const save = async () => {
    const row = {
      ...Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v === "" ? null : v])),
      id: user.id, birth_year: Number(f.birth_year), split: Number(f.split), is_complete: true,
    };
    delete row.created_at; delete row.updated_at;
    const { error } = await supabase.from("profiles").upsert(row);
    if (error) throw error;
    const srow = { user_id: user.id, visibility: sv.visibility || "contacts",
      gender: sv.gender || null, orientation: sv.orientation || null, religion: sv.religion || null };
    const { error: e2 } = await supabase.from("profile_sensitive").upsert(srow);
    if (e2) throw e2;
    await refreshProfile();
  };

  const submit = async e => {
    e.preventDefault(); setErr("");
    if (!editing && !last) { setSt(st + 1); window.scrollTo({ top: 0 }); return; }
    setBusy(true);
    try {
      await save();
      if (editing) setSaved(true); else nav("/entdecken");
    } catch (e2) { setErr(deErr(e2)); }
    setBusy(false);
  };

  const deleteAccount = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("delete_my_account");
    setBusy(false);
    if (error) { setErr(deErr(error)); setDel(false); return; }
    await signOut(); nav("/");
  };

  if (!user) return null;
  const thisYear = new Date().getFullYear();

  return (
    <div className="page wrap" style={{ maxWidth: 760 }}>
      <div className="ph" style={{ paddingBottom: 24 }}>
        <span className="eyebrow">{editing ? "Mein Profil" : "Willkommen bei Co-Nest"}</span>
        <h1>{editing ? <>Dein <em className="s">Profil.</em></> : <>Erzähl uns <em className="s">von dir.</em></>}</h1>
        {!editing && <p className="lead">Dein Profil ist nur für angemeldete Mitglieder sichtbar. Je mehr du angibst, desto besser passen die Vorschläge.</p>}
      </div>

      {editing ? (
        <div className="filters">{STEPS.map((s, i) => <button key={s} className={"chip" + (st === i ? " on" : "")} onClick={() => setSt(i)}>{s}</button>)}</div>
      ) : (
        <div className="prog">
          <div className="prog-bar"><div style={{ width: ((st + 1) / STEPS.length) * 100 + "%" }} /></div>
          <div className="prog-t">Schritt {st + 1} von {STEPS.length} · <b>{STEPS[st]}</b></div>
        </div>
      )}

      <form onSubmit={submit} key={st} className="page card-f">
        {st === 0 && <>
          <label className="f">Vorname<span className="opt"> (sichtbar für Mitglieder)</span><input required maxLength={60} value={f.first_name} onChange={e => up("first_name", e.target.value)} placeholder="z. B. Lena" /></label>
          <div className="row2">
            <label className="f">Geburtsjahr<input required type="number" min={1940} max={thisYear - 18} value={f.birth_year} onChange={e => up("birth_year", e.target.value)} placeholder="z. B. 1990" /></label>
            <Sel label="Kanton" required value={f.canton} onChange={v => up("canton", v)} opts={KANTONE} />
          </div>
          <label className="f">Ort<span className="opt"> (optional)</span><input maxLength={60} value={f.city} onChange={e => up("city", e.target.value)} placeholder="z. B. Winterthur" /></label>
          <Sel label="Meine Rolle in der Familie" required value={f.role} onChange={v => up("role", v)} opts={ROLE_LONG} />
          <Sel label="Hast du bereits Kinder?" required value={f.kids} onChange={v => up("kids", v)} opts={KIDS} />
          <div className="sens">
            <b>Freiwillige Angaben</b>
            <p>Diese Angaben sind besonders persönlich. Du entscheidest, ob und für wen sie sichtbar sind.</p>
            <Sel label="Geschlecht" value={sv.gender} onChange={v => upS("gender", v)} opts={OPT.gender} />
            <Sel label="Sexuelle Orientierung" value={sv.orientation} onChange={v => upS("orientation", v)} opts={OPT.orientation} />
            <Sel label="Religion" value={sv.religion} onChange={v => upS("religion", v)} opts={OPT.religion} />
            <label className="f">Sichtbar für
              <select value={sv.visibility} onChange={e => upS("visibility", e.target.value)}>
                {Object.entries(VISIBILITY).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select></label>
          </div>
        </>}
        {st === 1 && <>
          <label className="f">Beruf<span className="opt"> (optional)</span><input maxLength={80} value={f.job} onChange={e => up("job", e.target.value)} placeholder="z. B. Pflegefachfrau" /></label>
          <Sel label="Arbeitspensum" value={f.workload} onChange={v => up("workload", v)} opts={OPT.workload} hint="(optional)" />
          <Sel label="Wohnsituation" value={f.housing} onChange={v => up("housing", v)} opts={OPT.housing} hint="(optional)" />
          <label className="f">Sprachen<span className="opt"> (optional)</span><input maxLength={120} value={f.languages} onChange={e => up("languages", e.target.value)} placeholder="z. B. Deutsch, Französisch" /></label>
        </>}
        {st === 2 && <>
          <p className="dl-p">Diese Angaben helfen, Menschen mit ähnlichen Vorstellungen zu finden.</p>
          {Object.entries(VALUES).map(([k, l]) => <Sel key={k} label={l} value={f[k]} onChange={v => up(k, v)} opts={OPT[k]} />)}
        </>}
        {st === 3 && <>
          <Sel label="Bevorzugtes Familienmodell" required value={f.model} onChange={v => up("model", v)} opts={MODEL} />
          <label className="f rng">Gewünschte Aufteilung: <b>{SPLITS[f.split]?.l}</b>
            <input type="range" min="0" max="4" step="1" value={f.split} onChange={e => up("split", +e.target.value)} />
            <span className="rng-l"><span>Begleitende Rolle</span><span>70 / 30</span><span>50 / 50</span></span>
          </label>
          {Number(f.split) < 4 && (
            <div className="sidepick">
              <span>Ich übernehme</span>
              <button type="button" className={f.side === "gross" ? "on" : ""} onClick={() => up("side", "gross")}>den grösseren Teil ({SPLITS[f.split].big}%)</button>
              <button type="button" className={f.side === "klein" ? "on" : ""} onClick={() => up("side", "klein")}>den kleineren Teil ({100 - SPLITS[f.split].big}%)</button>
            </div>
          )}
          <label className="f">Kurz über mich<span className="opt"> (optional)</span>
            <textarea rows="5" maxLength={1500} value={f.about} onChange={e => up("about", e.target.value)} placeholder="Was ist dir bei gemeinsamer Elternschaft wichtig? Wie stellst du dir den Alltag vor?" /></label>
        </>}

        <Err>{err}</Err>
        {saved && <div className="ok" style={{ marginBottom: 14 }}>✓ Gespeichert.</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          {!editing && st > 0 && <button type="button" className="btn btn-g" style={{ flex: 1, justifyContent: "center" }} onClick={() => setSt(st - 1)}>Zurück</button>}
          <button className="btn btn-p" style={{ flex: 2, justifyContent: "center" }} disabled={busy}>
            {busy ? "Speichern …" : editing ? "Änderungen speichern" : last ? "Profil erstellen" : "Weiter"}</button>
        </div>
      </form>

      {editing && (
        <div className="acct">
          <h4 className="sec" style={{ marginBottom: 14 }}>Konto</h4>
          <p className="small" style={{ margin: "0 0 14px" }}>Angemeldet als {user.email}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-g" onClick={async () => { await signOut(); nav("/"); }}>Abmelden</button>
            <button className="btn btn-g red" style={{ borderColor: "#A4442F" }} onClick={() => setDel(true)}>Konto löschen</button>
          </div>
        </div>
      )}
      {!editing && <Note style={{ marginTop: 24 }}>Du kannst alle Angaben später unter «Mein Profil» ändern.</Note>}

      {del && (
        <Modal onClose={() => setDel(false)} className="dlg">
          <h3>Konto wirklich löschen?</h3>
          <p className="dl-p">Dein Profil, deine Kontaktanfragen und Nachrichten werden endgültig gelöscht. Das kann nicht rückgängig gemacht werden.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-g" style={{ flex: 1, justifyContent: "center" }} onClick={() => setDel(false)}>Abbrechen</button>
            <button className="btn btn-p red-b" style={{ flex: 1, justifyContent: "center" }} disabled={busy} onClick={deleteAccount}>Endgültig löschen</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
