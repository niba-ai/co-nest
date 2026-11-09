import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useAuth } from "../auth.jsx";
import { ROLE, KANTONE } from "../data.js";
import { Avatar, I, Arr, BtnLink, Modal, Err, deErr } from "../ui.jsx";
import { SafetyDialog } from "../safety.jsx";

const time = d => {
  const x = new Date(d), now = new Date();
  return x.toDateString() === now.toDateString()
    ? x.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })
    : x.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit" });
};

export function Messages() {
  const { user, profile } = useAuth();
  const me = user?.id;
  const [params, setParams] = useSearchParams();
  const active = params.get("mit");
  const [reqs, setReqs] = useState([]);
  const [people, setPeople] = useState({});
  const [last, setLast] = useState({});
  const [unread, setUnread] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState("");

  const loadOverview = useCallback(async () => {
    if (!me) return;
    const { data: rq, error } = await supabase.from("contact_requests").select("*")
      .or(`from_id.eq.${me},to_id.eq.${me}`).order("created_at", { ascending: false });
    if (error) { setErr(deErr(error)); return; }
    setReqs(rq || []);
    const ids = [...new Set((rq || []).map(x => (x.from_id === me ? x.to_id : x.from_id)))];
    if (ids.length) {
      const { data: ps } = await supabase.from("profiles").select("id,first_name,role,canton,city").in("id", ids);
      setPeople(Object.fromEntries((ps || []).map(p => [p.id, p])));
    }
    const { data: ms } = await supabase.from("messages").select("*")
      .or(`sender_id.eq.${me},receiver_id.eq.${me}`).order("created_at", { ascending: false }).limit(500);
    const L = {}, U = {};
    (ms || []).forEach(m => {
      const o = m.sender_id === me ? m.receiver_id : m.sender_id;
      if (!L[o]) L[o] = m;
      if (m.receiver_id === me && !m.read_at) U[o] = (U[o] || 0) + 1;
    });
    setLast(L); setUnread(U); setLoaded(true);
  }, [me]);

  useEffect(() => { loadOverview(); }, [loadOverview]);

  // Live: neue Nachrichten und Anfragen
  useEffect(() => {
    if (!me) return;
    const ch = supabase.channel("inbox-" + me)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `receiver_id=eq.${me}` }, () => loadOverview())
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_requests" }, () => loadOverview())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [me, loadOverview]);

  if (!user) return <div className="page wrap ph"><h1>Bitte <em className="s">anmelden.</em></h1><BtnLink to="/anmelden">Zur Anmeldung <Arr /></BtnLink></div>;
  if (!profile?.is_complete) return <div className="page wrap ph"><h1>Erstelle zuerst <em className="s">dein Profil.</em></h1><BtnLink to="/profil">Profil erstellen <Arr /></BtnLink></div>;

  const incoming = reqs.filter(r => r.to_id === me && r.status === "pending");
  const contacts = reqs.filter(r => r.status === "accepted")
    .map(r => (r.from_id === me ? r.to_id : r.from_id))
    .filter(id => people[id])
    .sort((a, b) => (last[b]?.created_at || "").localeCompare(last[a]?.created_at || ""));
  const open = id => setParams(id ? { mit: id } : {});
  const cur = active && contacts.includes(active) ? people[active] : null;

  const answer = async (r, ok) => {
    const { error } = await supabase.from("contact_requests").update({ status: ok ? "accepted" : "declined", responded_at: new Date().toISOString() }).eq("id", r.id);
    if (error) return setErr(deErr(error));
    await loadOverview();
    if (ok) open(r.from_id);
  };

  if (loaded && !contacts.length && !incoming.length) return (
    <div className="page wrap ph" style={{ minHeight: "60vh" }}>
      <span className="eyebrow">Nachrichten</span>
      <h1>Noch keine <em className="s">Gespräche.</em></h1>
      <p className="lead" style={{ marginBottom: 30 }}>Sobald jemand deine Kontaktanfrage annimmt, könnt ihr hier schreiben.</p>
      <BtnLink to="/entdecken">Vorschläge ansehen <Arr /></BtnLink>
    </div>
  );

  return (
    <div className="page msg wrap">
      <aside className={"mlist" + (cur ? " hide-m" : "")}>
        <div className="mlist-h"><span className="eyebrow">Nachrichten</span><h2>Gespräche</h2></div>
        <Err>{err}</Err>
        {incoming.length > 0 && <div className="inc">
          <h4 className="sec" style={{ margin: "4px 6px 10px" }}>Neue Anfragen</h4>
          {incoming.map(r => {
            const p = people[r.from_id]; if (!p) return null;
            return (
              <div key={r.id} className="inc-i">
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Avatar name={p.first_name} id={p.id} size={40} />
                  <div className="mi-t"><b>{p.first_name}</b><span>{ROLE[p.role]} · {p.city || KANTONE[p.canton]}</span></div>
                </div>
                {r.message && <p className="inc-m">«{r.message}»</p>}
                <div style={{ display: "flex", gap: 8 }}>
                  <Link to="/entdecken" className="btn btn-g sm">Profil</Link>
                  <button className="btn btn-g sm" onClick={() => answer(r, false)}>Ablehnen</button>
                  <button className="btn btn-p sm" onClick={() => answer(r, true)}>Annehmen</button>
                </div>
              </div>
            );
          })}
        </div>}
        {contacts.map(id => {
          const p = people[id], l = last[id];
          return (
            <button key={id} className={"mi" + (active === id ? " on" : "")} onClick={() => open(id)}>
              <Avatar name={p.first_name} id={id} />
              <div className="mi-t"><b>{p.first_name}</b><span>{l ? (l.sender_id === me ? "Du: " : "") + l.body : "Kontakt angenommen – sag Hallo!"}</span></div>
              {unread[id] ? <span className="hb static">{unread[id]}</span> : l && <small>{time(l.created_at)}</small>}
            </button>
          );
        })}
      </aside>
      <section className={"chat" + (cur ? "" : " hide-m")}>
        {cur ? <Chat key={cur.id} me={me} other={cur} onBack={() => open(null)} onChanged={loadOverview} />
          : <div className="chat-empty">Wähle links ein Gespräch aus.</div>}
      </section>
    </div>
  );
}

function Chat({ me, other, onBack, onChanged }) {
  const [msgs, setMsgs] = useState([]);
  const [txt, setTxt] = useState("");
  const [menu, setMenu] = useState(false);
  const [dlg, setDlg] = useState(null);   // video | report | block
  const [err, setErr] = useState("");
  const endRef = useRef(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("messages").select("*")
      .or(`and(sender_id.eq.${me},receiver_id.eq.${other.id}),and(sender_id.eq.${other.id},receiver_id.eq.${me})`)
      .order("created_at", { ascending: true }).limit(1000);
    if (error) return setErr(deErr(error));
    setMsgs(data || []);
    const unread = (data || []).some(m => m.receiver_id === me && !m.read_at);
    if (unread) {
      await supabase.from("messages").update({ read_at: new Date().toISOString() })
        .eq("receiver_id", me).eq("sender_id", other.id).is("read_at", null);
      onChanged();
    }
  }, [me, other.id, onChanged]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const ch = supabase.channel(`chat-${me}-${other.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `sender_id=eq.${other.id}` },
        ({ new: m }) => { if (m.receiver_id === me) load(); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [me, other.id, load]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [msgs]);

  const send = async e => {
    e.preventDefault();
    const body = txt.trim(); if (!body) return;
    setTxt(""); setErr("");
    const { data, error } = await supabase.from("messages").insert({ sender_id: me, receiver_id: other.id, body }).select().single();
    if (error) { setTxt(body); return setErr(deErr(error)); }
    setMsgs(m => [...m, data]); onChanged();
  };

  return <>
    <div className="chat-h">
      <button className="ib only-m" onClick={onBack} aria-label="Zurück">{I.back}</button>
      <Avatar name={other.first_name} id={other.id} size={40} />
      <div className="chat-who"><b>{other.first_name}</b><span>{ROLE[other.role]} · {other.city || KANTONE[other.canton]}</span></div>
      <button className="ib" onClick={() => setDlg("video")} aria-label="Videoanruf" title="Videoanruf">{I.video}</button>
      <div style={{ position: "relative" }}>
        <button className="ib" onClick={() => setMenu(!menu)} aria-label="Mehr">{I.dots}</button>
        {menu && <div className="dd">
          <button onClick={() => { setMenu(false); setDlg("report"); }}>Melden</button>
          <button className="red" onClick={() => { setMenu(false); setDlg("block"); }}>Blockieren</button>
        </div>}
      </div>
    </div>
    <div className="chat-b">
      <div className="safe">{I.shield}<span>Zu deiner Sicherheit: Teile keine Bank- oder Ausweisdaten und triff dich beim ersten Mal an einem öffentlichen Ort.</span></div>
      {msgs.map(m => (
        <div key={m.id} className={"bub" + (m.sender_id === me ? " me" : "")}><p>{m.body}</p><small>{time(m.created_at)}</small></div>
      ))}
      <div ref={endRef} />
    </div>
    <Err>{err}</Err>
    <form className="chat-f" onSubmit={send}>
      <input value={txt} onChange={e => setTxt(e.target.value)} maxLength={4000} placeholder="Nachricht schreiben …" />
      <button className="sendb" aria-label="Senden">{I.send}</button>
    </form>
    {dlg === "video" && (
      <Modal onClose={() => setDlg(null)} className="dlg">
        <h3>Videoanrufe kommen bald.</h3>
        <p className="dl-p">Wir arbeiten an Videoanrufen direkt in Nid Commun, ohne dass ihr eure Telefonnummer teilen müsst. Bis dahin könnt ihr hier schreiben.</p>
        <button className="btn btn-p full" onClick={() => setDlg(null)}>Verstanden</button>
      </Modal>
    )}
    {(dlg === "report" || dlg === "block") && (
      <SafetyDialog mode={dlg} me={me} other={other} onClose={() => setDlg(null)} onBlocked={() => { onBack(); onChanged(); }} />
    )}
  </>;
}
