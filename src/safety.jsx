import { useState } from "react";
import { supabase } from "./supabase.js";
import { REPORT_REASONS } from "./data.js";
import { Modal, Err, deErr } from "./ui.jsx";

// Dialog zum Melden oder Blockieren eines Mitglieds
export function SafetyDialog({ mode, me, other, onClose, onBlocked }) {
  const [step, setStep] = useState(mode);   // report | block | done
  const [why, setWhy] = useState("");
  const [details, setDetails] = useState("");
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const block = async () => {
    const { error } = await supabase.from("blocks").insert({ blocker_id: me, blocked_id: other.id });
    if (error && !String(error.message).includes("duplicate")) throw error;
  };

  const sendReport = async e => {
    e.preventDefault(); setBusy(true); setErr("");
    try {
      const { error } = await supabase.from("reports").insert({ reporter_id: me, reported_id: other.id, reason: why, details: details || null });
      if (error) throw error;
      if (alsoBlock) { await block(); onBlocked?.(); onClose(); return; }
      setStep("done");
    } catch (e2) { setErr(deErr(e2)); }
    setBusy(false);
  };

  const doBlock = async () => {
    setBusy(true); setErr("");
    try { await block(); onBlocked?.(); onClose(); } catch (e2) { setErr(deErr(e2)); setBusy(false); }
  };

  return (
    <Modal onClose={onClose} className="dlg">
      {step === "report" && (
        <form onSubmit={sendReport}>
          <h3>{other.first_name} melden</h3>
          <p className="dl-p">Was ist passiert? Deine Meldung ist vertraulich. {other.first_name} erfährt nicht, wer gemeldet hat.</p>
          <div className="radios">
            {REPORT_REASONS.map(r => <label key={r} className={why === r ? "on" : ""}><input type="radio" name="why" required checked={why === r} onChange={() => setWhy(r)} />{r}</label>)}
          </div>
          <label className="f">Weitere Details (optional)<textarea rows="3" maxLength={2000} value={details} onChange={e => setDetails(e.target.value)} /></label>
          <label className="chk"><input type="checkbox" checked={alsoBlock} onChange={e => setAlsoBlock(e.target.checked)} /> {other.first_name} zusätzlich blockieren</label>
          <Err>{err}</Err>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className="btn btn-g" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Abbrechen</button>
            <button className="btn btn-p" style={{ flex: 1, justifyContent: "center" }} disabled={busy}>Meldung senden</button>
          </div>
        </form>
      )}
      {step === "done" && <>
        <h3>Danke für deine Meldung.</h3>
        <p className="dl-p">Wir prüfen sie vertraulich.</p>
        <button className="btn btn-p full" onClick={onClose}>Schliessen</button>
      </>}
      {step === "block" && <>
        <h3>{other.first_name} blockieren?</h3>
        <p className="dl-p">{other.first_name} kann dir dann keine Nachrichten mehr schreiben und dein Profil nicht mehr sehen. Ihr verschwindet gegenseitig aus euren Listen.</p>
        <Err>{err}</Err>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-g" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Abbrechen</button>
          <button className="btn btn-p red-b" style={{ flex: 1, justifyContent: "center" }} disabled={busy} onClick={doBlock}>Blockieren</button>
        </div>
      </>}
    </Modal>
  );
}
