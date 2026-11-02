import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import { supabase } from "./supabase.js";
import { I } from "./ui.jsx";

const NAV = [
  ["/so-funktionierts", "So funktioniert's"],
  ["/entdecken", "Co-Parenting entdecken"],
  ["/ueber-uns", "Über uns"],
  ["/faq", "Häufige Fragen"],
];

export const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M4 17c0 6.5 5.4 11 12 11s12-4.5 12-11" fill="none" stroke="#8B6A4E" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M7 20.5c2.5 2.6 5.6 3.8 9 3.8s6.5-1.2 9-3.8" fill="none" stroke="#C2A27F" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="12.5" cy="12" r="4" fill="#C2A27F" /><circle cx="19.5" cy="12" r="4" fill="#8B6A4E" /><circle cx="16" cy="16.5" r="2.6" fill="#E3CDB0" />
  </svg>
);

function usePendingCount(user) {
  const [n, setN] = useState(0);
  const loc = useLocation();
  useEffect(() => {
    if (!user) { setN(0); return; }
    supabase.from("contact_requests").select("id", { count: "exact", head: true })
      .eq("to_id", user.id).eq("status", "pending")
      .then(({ count }) => setN(count || 0));
  }, [user, loc.pathname]);
  return n;
}

export function Header() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [sc, setSc] = useState(false);
  const nav = useNavigate();
  const pending = usePendingCount(user);
  const loc = useLocation();
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const f = () => setSc(window.scrollY > 10);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  const out = async () => { await signOut(); nav("/"); };

  return (
    <header className={sc ? "sc" : ""}>
      <div className="wrap hd">
        <Link to="/" className="logo"><Logo />Co-Nest</Link>
        <nav className="main">
          {NAV.map(([to, l]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? "on" : ""}>{l}</NavLink>)}
        </nav>
        <div className="hd-r">
          {user ? <>
            <Link to="/nachrichten" className="hchat" aria-label="Nachrichten">{I.chat}{pending > 0 && <span className="hb">{pending}</span>}</Link>
            <Link to="/profil" className="hchat hide-s" aria-label="Mein Profil">{I.user}</Link>
          </> : <Link to="/anmelden" className="btn btn-p">Registrieren / Anmelden</Link>}
          <button className="burger" aria-label="Menü" onClick={() => setOpen(!open)}>{open ? I.close : I.menu}</button>
        </div>
      </div>
      {open && (
        <div className="mnav">
          <Link to="/">Startseite</Link>
          {NAV.map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}
          {user ? <>
            <Link to="/nachrichten">Nachrichten</Link>
            <Link to="/profil">Mein Profil</Link>
            <button className="btn btn-g" style={{ marginTop: 24, justifyContent: "center" }} onClick={out}>Abmelden</button>
          </> : <Link to="/anmelden" className="btn btn-p" style={{ fontFamily: "var(--sans)", fontSize: 15, border: "none" }}>Registrieren / Anmelden</Link>}
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { user, signOut } = useAuth();
  return (
    <footer>
      <div className="wrap">
        <div className="ft">
          <div>
            <div className="logo" style={{ marginBottom: 14 }}><Logo />Co-Nest</div>
            <p style={{ maxWidth: 300 }}>Die Schweizer Plattform für Menschen, die gemeinsam Eltern werden möchten – mit Respekt, Klarheit und Herz.</p>
          </div>
          <div><h5>Plattform</h5><Link to="/so-funktionierts">So funktioniert's</Link><Link to="/entdecken">Entdecken</Link>
            {user ? <a href="#" onClick={e => { e.preventDefault(); signOut(); }}>Abmelden</a> : <Link to="/anmelden">Registrieren</Link>}</div>
          <div><h5>Über uns</h5><Link to="/ueber-uns">Unsere Geschichte</Link><Link to="/faq">Häufige Fragen</Link></div>
          <div><h5>Rechtliches</h5><Link to="/datenschutz">Datenschutz</Link><Link to="/agb">AGB</Link><Link to="/impressum">Impressum</Link></div>
        </div>
        <div className="fb"><span>© {new Date().getFullYear()} Co-Nest</span><span>Mit Sorgfalt gestaltet in der Schweiz</span></div>
      </div>
    </footer>
  );
}
