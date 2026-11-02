import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useAuth } from "../auth.jsx";
import { Scene, Err, deErr } from "../ui.jsx";

function Shell({ title, children }) {
  return (
    <div className="auth page">
      <div className="side"><Scene v={5} /><div className="txt"><h2>Dein Weg zur Familie beginnt hier.</h2></div></div>
      <div className="form"><div className="fbox">
        <span className="eyebrow">Willkommen</span>
        <h2 style={{ marginTop: 10, fontSize: 42 }}>{title}</h2>
        {children}
      </div></div>
    </div>
  );
}

export function AuthPage() {
  const { user, profile, loading } = useAuth();
  const nav = useNavigate();
  const [t, setT] = useState("reg");      // reg | log | forgot
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (!loading && user) nav(profile?.is_complete ? "/entdecken" : "/profil", { replace: true });
  }, [user, profile, loading, nav]);

  const sw = x => { setT(x); setErr(""); setOk(""); };

  const submit = async e => {
    e.preventDefault(); setErr(""); setOk(""); setBusy(true);
    try {
      if (t === "reg") {
        if (pw.length < 8) throw new Error("Password should be at least 8 characters");
        const { data, error } = await supabase.auth.signUp({
          email, password: pw, options: { emailRedirectTo: window.location.origin + "/profil" },
        });
        if (error) throw error;
        if (!data.session) setOk("Fast geschafft! Wir haben dir eine E-Mail geschickt. Klicke auf den Link darin, um dein Konto zu bestätigen. Danach erstellst du dein Profil.");
      } else if (t === "log") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/passwort-neu" });
        if (error) throw error;
        setOk("Falls ein Konto mit dieser E-Mail existiert, haben wir dir einen Link zum Zurücksetzen geschickt.");
      }
    } catch (e2) { setErr(deErr(e2)); }
    setBusy(false);
  };

  return (
    <Shell title={t === "reg" ? "Konto erstellen" : t === "log" ? "Schön, dass du da bist" : "Passwort vergessen"}>
      {t !== "forgot" && (
        <div className="tabs">
          <button className={t === "reg" ? "on" : ""} onClick={() => sw("reg")}>Registrieren</button>
          <button className={t === "log" ? "on" : ""} onClick={() => sw("log")}>Anmelden</button>
        </div>
      )}
      {t === "forgot" && <p className="dl-p" style={{ marginTop: 14 }}>Gib deine E-Mail-Adresse ein. Du bekommst einen Link, um ein neues Passwort zu setzen.</p>}
      {ok ? <div className="ok">{ok}</div> : (
        <form onSubmit={submit}>
          <label className="f">E-Mail<input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@beispiel.ch" /></label>
          {t !== "forgot" && <label className="f">Passwort{t === "reg" && <span className="opt"> (mind. 8 Zeichen)</span>}
            <input type="password" required minLength={t === "reg" ? 8 : undefined} autoComplete={t === "reg" ? "new-password" : "current-password"} value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" /></label>}
          {t === "reg" && (
            <label className="chk" style={{ alignItems: "flex-start" }}><input type="checkbox" required style={{ marginTop: 2 }} />
              <span>Ich akzeptiere die <Link to="/agb" style={{ textDecoration: "underline" }}>AGB</Link> und die <Link to="/datenschutz" style={{ textDecoration: "underline" }}>Datenschutzerklärung</Link> und bin mindestens 18 Jahre alt.</span></label>
          )}
          <Err>{err}</Err>
          <button className="btn btn-p full" disabled={busy}>{busy ? "Einen Moment …" : t === "reg" ? "Konto erstellen" : t === "log" ? "Anmelden" : "Link senden"}</button>
        </form>
      )}
      <p className="small" style={{ marginTop: 18 }}>
        {t === "log" && <a href="#" onClick={e => { e.preventDefault(); sw("forgot"); }} style={{ textDecoration: "underline" }}>Passwort vergessen?</a>}
        {t === "forgot" && <a href="#" onClick={e => { e.preventDefault(); sw("log"); }} style={{ textDecoration: "underline" }}>Zurück zur Anmeldung</a>}
      </p>
    </Shell>
  );
}

export function ResetPassword() {
  const { user, setRecovery } = useAuth();
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault(); setErr(""); setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr(deErr(error));
    setRecovery(false); nav("/entdecken");
  };
  return (
    <Shell title="Neues Passwort">
      {!user ? <p className="dl-p" style={{ marginTop: 14 }}>Bitte öffne den Link aus der E-Mail erneut. Er ist nur kurze Zeit gültig.</p> : (
        <form onSubmit={submit} style={{ marginTop: 20 }}>
          <label className="f">Neues Passwort<span className="opt"> (mind. 8 Zeichen)</span>
            <input type="password" required minLength={8} autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} /></label>
          <Err>{err}</Err>
          <button className="btn btn-p full" disabled={busy}>Passwort speichern</button>
        </form>
      )}
    </Shell>
  );
}
