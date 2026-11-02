import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { configured } from "./supabase.js";
import { useAuth } from "./auth.jsx";
import { Header, Footer } from "./layout.jsx";
import { Home, How, About, Faq, Legal, NotFound } from "./pages/Content.jsx";
import { AuthPage, ResetPassword } from "./pages/Auth.jsx";
import { ProfilePage } from "./pages/Profile.jsx";
import { Discover } from "./pages/Discover.jsx";
import { Messages } from "./pages/Messages.jsx";

// Geschützte Seiten: nur für angemeldete Mitglieder
function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="boot">Einen Moment …</div>;
  return user ? children : <Navigate to="/anmelden" replace />;
}

function SetupHint() {
  return (
    <div className="wrap ph">
      <span className="eyebrow">Einrichtung</span>
      <h1>Fast <em className="s">bereit.</em></h1>
      <p className="lead">Die Verbindung zur Datenbank fehlt noch. Trage beim Hosting die Werte <b>VITE_SUPABASE_URL</b> und <b>VITE_SUPABASE_ANON_KEY</b> ein und starte den Build neu (siehe ANLEITUNG.md, Schritt 4).</p>
    </div>
  );
}

export default function App() {
  const loc = useLocation();
  const nav = useNavigate();
  const { recovery } = useAuth();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [loc.pathname]);
  useEffect(() => { if (recovery && loc.pathname !== "/passwort-neu") nav("/passwort-neu"); }, [recovery, loc.pathname, nav]);

  if (!configured) return <><Header /><SetupHint /></>;
  const bare = ["/anmelden", "/nachrichten", "/passwort-neu"].includes(loc.pathname);

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/so-funktionierts" element={<How />} />
          <Route path="/entdecken" element={<Discover />} />
          <Route path="/ueber-uns" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/anmelden" element={<AuthPage />} />
          <Route path="/passwort-neu" element={<ResetPassword />} />
          <Route path="/profil" element={<Private><ProfilePage /></Private>} />
          <Route path="/nachrichten" element={<Private><Messages /></Private>} />
          <Route path="/impressum" element={<Legal kind="impressum" />} />
          <Route path="/agb" element={<Legal kind="agb" />} />
          <Route path="/datenschutz" element={<Legal kind="datenschutz" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!bare && <Footer />}
    </>
  );
}
