import { useState } from "react";
import { Scene, I, Arr, BtnLink, Spectrum, Steps, Note } from "../ui.jsx";
import { useAuth } from "../auth.jsx";

/* ---------------- Startseite ---------------- */
export function Home() {
  const { user } = useAuth();
  return (
    <div className="page">
      <section className="hero">
        <div className="wrap hero-g">
          <div>
            <span className="eyebrow">Nid Commun · Familie, nicht gewöhnlich</span>
            <h1>Gemeinsam Eltern werden. <em className="s">Auf eure Weise.</em></h1>
            <p className="lead">Finde Menschen in der Schweiz, die deinen Kinderwunsch und deine Vorstellungen von gemeinsamer Elternschaft teilen.</p>
            <div className="hero-btns">
              <BtnLink to="/entdecken">Jetzt entdecken <Arr /></BtnLink>
              <BtnLink to="/so-funktionierts" ghost>So funktioniert's</BtnLink>
            </div>
            <div className="trust">
              <span>{I.check} Daten in der Schweiz</span>
              <span>{I.check} Keine Dating-App</span>
              <span>{I.check} Kostenlos</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="arch"><Scene v={0} /></div>
            <div className="float f1"><div className="dot">{I.users}</div><div><b>Zu zweit, zu dritt, zu viert</b>verliebt oder befreundet</div></div>
            <div className="float f2"><div className="dot">{I.heart}</div><div><b>Werte zuerst</b>nicht Aussehen</div></div>
          </div>
        </div>
      </section>

      <section className="blk" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="sh">
            <span className="eyebrow">Zwei Wege zur Familie</span>
            <h2>Jede Familie ist <em className="s">einzigartig.</em></h2>
            <p className="lead">Zu zweit, zu dritt oder zu viert, verliebt oder befreundet: Familie ist, was ihr daraus macht. Ihr entscheidet, wie ihr Verantwortung, Zeit und Alltag aufteilt.</p>
          </div>
          <div className="models">
            <article className="model">
              <div className="img"><Scene v={2} /></div>
              <div className="bd">
                <span className="num">Modell 01</span><h3>Halb-halb</h3>
                <p>Gleichberechtigte Co-Elternschaft: Beide Eltern tragen Betreuung, Entscheidungen und Kosten zu gleichen Teilen.</p>
                <ul><li>Geteilte Betreuung, z. B. 50/50</li><li>Gemeinsame Entscheidungen im Alltag</li><li>Ideal bei Wohnorten in der Nähe</li></ul>
              </div>
            </article>
            <article className="model">
              <div className="img"><Scene v={1} /></div>
              <div className="bd">
                <span className="num">Modell 02</span><h3>Nach Mass</h3>
                <p>Flexible Co-Elternschaft: Die Rollen werden individuell verteilt – passend zu euren Lebensumständen.</p>
                <ul><li>Eine Hauptbezugsperson, eine unterstützende Rolle</li><li>Umfang und Kontakt frei vereinbar</li><li>Für Einzelpersonen, Paare und Gruppen</li></ul>
              </div>
            </article>
          </div>
          <Spectrum />
        </div>
      </section>

      <section className="blk bg-sage">
        <div className="wrap">
          <div className="sh center" style={{ textAlign: "center" }}>
            <span className="eyebrow">In vier Schritten</span>
            <h2>Von der Idee zur <em className="s">gemeinsamen Familie.</em></h2>
          </div>
          <Steps />
          <div style={{ textAlign: "center", marginTop: 44 }}><BtnLink to="/so-funktionierts" ghost>Mehr erfahren <Arr /></BtnLink></div>
        </div>
      </section>

      <section className="blk">
        <div className="wrap vals">
          <div>
            <span className="eyebrow">Unser Versprechen</span>
            <p className="quote" style={{ marginTop: 20 }}>«Manchmal ist jemand ein wunderbarer Elternteil – aber nicht der richtige Partner. Beides darf sein.»</p>
            <p className="quote-by">— Nid Commun: «gemeinsames Nest». Und auf Schweizerdeutsch: nid gwöhnlich.</p>
          </div>
          <div className="vlist">
            <div className="v"><div className="ic">{I.shield}</div><div><h4>Sicherheit & Vertrauen</h4><p>Profile sind nur für angemeldete Mitglieder sichtbar. Deine Daten liegen in der Schweiz.</p></div></div>
            <div className="v"><div className="ic">{I.heart}</div><div><h4>Das Kind im Mittelpunkt</h4><p>Profile drehen sich um Werte, Erziehung und Alltag – nicht um Äusserlichkeiten.</p></div></div>
            <div className="v"><div className="ic">{I.users}</div><div><h4>Platz für jede Familie</h4><p>Ob erstes Kind oder Patchwork, alleinerziehend, queer, polyamor oder als Freundeskreis: Alle sind willkommen.</p></div></div>
            <div className="v"><div className="ic">{I.home}</div><div><h4>Kontaktanfragen statt Swipen</h4><p>Kontaktanfragen statt Massennachrichten – ihr lernt euch in Ruhe kennen.</p></div></div>
          </div>
        </div>
      </section>

      {!user && (
        <section className="wrap">
          <div className="cta">
            <h2>Bereit für den ersten Schritt?</h2>
            <p>Erstelle dein Profil in wenigen Minuten und entdecke Menschen, die deinen Kinderwunsch teilen.</p>
            <BtnLink to="/anmelden">Kostenlos registrieren <Arr /></BtnLink>
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------------- So funktioniert's ---------------- */
export function How() {
  return (
    <div className="page">
      <div className="wrap ph">
        <span className="eyebrow">So funktioniert's</span>
        <h1>Klar, sicher und <em className="s">in eurem Tempo.</em></h1>
        <p className="lead">Co-Parenting ist eine grosse Entscheidung. Darum begleiten wir dich vom ersten Profil bis zum ersten Gespräch.</p>
      </div>
      <section className="wrap" style={{ paddingBottom: 40 }}><Steps /></section>
      <section className="blk"><div className="wrap two">
        <div className="img"><Scene v={3} /></div>
        <div className="prose">
          <span className="eyebrow">Wichtig zu wissen</span>
          <h2 style={{ margin: "16px 0 24px" }}>Gut vorbereitet in die Elternschaft.</h2>
          <p>Bevor ihr euch für ein gemeinsames Kind entscheidet, solltet ihr über Erziehung, Wohnort, Finanzen, Betreuung und Zukunftspläne sprechen.</p>
          <p>Wir empfehlen eine unabhängige rechtliche und medizinische Beratung und eine schriftliche Co-Parenting-Vereinbarung.</p>
          <BtnLink to="/anmelden" style={{ marginTop: 10 }}>Profil erstellen <Arr /></BtnLink>
        </div>
      </div></section>
    </div>
  );
}

/* ---------------- Über uns ---------------- */
export function About() {
  const { user } = useAuth();
  const V = [
    ["Gute Eltern, nicht zwingend ein Paar", "Manche Menschen sind wunderbare Mütter oder Väter – ohne dass eine Liebesbeziehung dazugehören muss."],
    ["Alle Familienformen willkommen", "Ob alleinstehend, alleinerziehend, queer, polyamor, als Paar oder als Gruppe: Bei Nid Commun bist du so willkommen, wie du bist."],
    ["Du wählst deinen Weg", "Halb-halb, Nach Mass oder etwas dazwischen – ihr entscheidet selbst, wie eure Familie aussieht."],
  ];
  return (
    <div className="page">
      <div className="wrap ph">
        <span className="eyebrow">Über uns</span>
        <h1>Familie darf <em className="s">viele Formen haben.</em></h1>
      </div>
      <section className="wrap two" style={{ paddingBottom: 40 }}>
        <div className="prose">
          <p style={{ fontFamily: "var(--serif)", fontSize: 26, lineHeight: 1.35, color: "var(--ink)", fontStyle: "italic" }}>«Nicht jeder Mensch, der ein guter Elternteil wäre, ist auch der richtige romantische Partner. Und das ist in Ordnung.»</p>
          <p>Heute ist es schwierig, Menschen zu finden, mit denen man offen über den eigenen Kinderwunsch sprechen kann. Im Alltag, im Freundeskreis oder auf Dating-Apps ist dafür selten Platz.</p>
          <p>Dabei gibt es so viele Wege, eine Familie zu gründen. Manche Menschen sind alleinerziehend, andere leben in einer gleichgeschlechtlichen oder polyamoren Beziehung, wieder andere haben schon Kinder und wünschen sich ein weiteres – oder möchten zu dritt oder zu viert Eltern werden.</p>
          <p>Darum heisst die Plattform <b>Nid Commun</b>: ein gemeinsames Nest für Familien, die nicht gewöhnlich sind – oder, wie man in der Deutschschweiz sagt: nid gwöhnlich.</p>
          <p>Nid Commun ist entstanden, damit all diese Menschen einen geschützten Ort haben, an dem sie einander finden. Jede Lebensform ist hier akzeptiert. Jede und jeder soll die Familie gründen können, die zu ihr oder ihm passt.</p>
        </div>
        <div className="img"><Scene v={4} /></div>
      </section>
      <section className="blk" style={{ paddingTop: 60 }}>
        <div className="wrap">
          <div className="grid3">
            {V.map(([t, d]) => <div className="step" key={t}><h4 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 500, marginBottom: 10 }}>{t}</h4><p>{d}</p></div>)}
          </div>
          <div className="cta" style={{ marginTop: 60 }}>
            <h2>Nid Commun ist kostenlos.</h2>
            <p>Registrieren, Vorschläge ansehen, Kontaktanfragen senden und schreiben – alles ohne Kosten.</p>
            <BtnLink to={user ? "/entdecken" : "/anmelden"}>{user ? "Vorschläge ansehen" : "Jetzt kostenlos registrieren"} <Arr /></BtnLink>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Häufige Fragen ---------------- */
const FAQ = [
  ["Was ist Co-Parenting?", "Beim Co-Parenting entscheiden sich zwei (oder mehr) Menschen bewusst dafür, gemeinsam ein Kind grosszuziehen – ohne romantische Beziehung. Im Mittelpunkt stehen das Wohl des Kindes, Vertrauen und klare Absprachen."],
  ["Ist das eine Dating-App?", "Nein. Bei uns geht es nicht um Partnersuche, sondern um gemeinsame Elternschaft. Profile drehen sich um Werte, Lebensumstände und Vorstellungen vom Familienalltag."],
  ["Worin unterscheiden sich «Halb-halb» und «Nach Mass»?", "Beim Modell «Halb-halb» teilen sich beide Eltern Betreuung, Verantwortung und Kosten etwa zu gleichen Teilen. Beim Modell «Nach Mass» übernimmt ein Elternteil z. B. die Hauptbetreuung, der andere ist regelmässig, aber in kleinerem Umfang präsent. Dazwischen ist jede Abstufung möglich."],
  ["Welche Rollen gibt es?", "Du wählst, ob du als Mutter, als Vater, als Elternteil ohne Festlegung oder als begleitende Bezugsperson dabei sein möchtest. «Elternteil» passt zum Beispiel für nonbinäre Menschen oder alle, die sich nicht als Mutter oder Vater bezeichnen möchten. Eine begleitende Bezugsperson ist regelmässig für das Kind da – ähnlich wie eine Gotte oder ein Götti –, trägt aber weniger Alltagsverantwortung."],
  ["Können wir als Paar oder zu dritt / zu viert mitmachen?", "Ja. Du kannst dich als Einzelperson, als Paar oder als Gruppe registrieren. Wichtig zu wissen: In der Schweiz kann ein Kind rechtlich höchstens zwei Elternteile haben. Weitere Bezugspersonen sind rechtlich nicht automatisch abgesichert. Haltet eure Abmachungen deshalb schriftlich fest und lasst euch rechtlich beraten."],
  ["Was bedeutet «Nid Commun»?", "Auf Französisch heisst es «gemeinsames Nest». Und weil «nid» auf Schweizerdeutsch «nicht» bedeutet, liest man es auch als «nid gwöhnlich» – passend für Familien, die anders sind als das klassische Bild."],
  ["Kann ich mitmachen, wenn ich schon Kinder habe?", "Ja, sehr gerne. Im Profil gibst du an, ob du schon Kinder hast. So finden sich auch Menschen, die offen für eine Patchwork-Familie sind."],
  ["Wer sieht mein Profil?", "Nur angemeldete Mitglieder. Angaben wie Geschlecht, sexuelle Orientierung und Religion sind freiwillig – du bestimmst, ob sie alle Mitglieder, nur bestätigte Kontakte oder niemand sieht."],
  ["Wo werden meine Daten gespeichert?", "Profile, Nachrichten und Konten liegen in einem Rechenzentrum in Zürich."],
  ["Wie sieht es rechtlich in der Schweiz aus?", "Abstammung, Sorgerecht und Unterhalt sind gesetzlich geregelt und hängen von eurer Situation ab. Wir empfehlen, vor dem Kinderwunsch eine unabhängige rechtliche Beratung zu nutzen und eine Co-Parenting-Vereinbarung festzuhalten. Nid Commun bietet keine Rechtsberatung."],
  ["Was kostet Nid Commun?", "Nid Commun ist kostenlos. Registrierung, Vorschläge, Kontaktanfragen und Nachrichten kosten nichts."],
  ["Kann ich mein Konto löschen?", "Ja, jederzeit unter «Mein Profil». Dein Profil, deine Anfragen und Nachrichten werden dann gelöscht."],
];
export function Faq() {
  const [o, setO] = useState(0);
  return (
    <div className="page">
      <div className="wrap ph"><span className="eyebrow">Häufige Fragen</span><h1>Gut zu <em className="s">wissen.</em></h1></div>
      <div className="wrap"><div className="faq">
        {FAQ.map(([q, a], i) => (
          <div className={"qa" + (o === i ? " op" : "")} key={i}>
            <button onClick={() => setO(o === i ? -1 : i)}>{q}<span className="pl">+</span></button>
            {o === i && <p className="ans">{a}</p>}
          </div>
        ))}
      </div></div>
    </div>
  );
}

/* ---------------- Rechtliches (Vorlagen) ---------------- */
const P = ({ children }) => <span className="ph-mark">{children}</span>;
const LEGAL = {
  impressum: { t: "Impressum", items: [
    ["Betreiberin", <>Nid Commun <P>[Rechtsform, z. B. GmbH]</P></>],
    ["Adresse", <><P>[c/o Name des Adressgebers]</P><br /><P>[Strasse Nr.]</P><br /><P>[PLZ Ort]</P>, Schweiz</>],
    ["Kontakt", <>E-Mail: <P>[hallo@nidcommun.ch]</P></>],
    ["Handelsregister / UID", <P>[falls vorhanden]</P>],
    ["Haftung für Links", "Für Inhalte externer Websites, auf die wir verlinken, übernehmen wir keine Verantwortung."],
  ]},
  agb: { t: "Allgemeine Geschäftsbedingungen", items: [
    ["1. Geltungsbereich", "Diese Bedingungen gelten für die Nutzung der Plattform Nid Commun."],
    ["2. Leistungen", "Nid Commun bringt Menschen mit Kinderwunsch zusammen. Wir vermitteln Kontakte, sind aber nicht Partei von Vereinbarungen zwischen Mitgliedern und garantieren keinen Erfolg."],
    ["3. Registrierung", "Mitglied werden kann, wer mindestens 18 Jahre alt ist und wahrheitsgemässe Angaben macht. Pro Person ist ein Konto erlaubt."],
    ["4. Verhalten", "Respektvoller Umgang, keine kommerziellen Absichten, keine Belästigung, keine falschen Profile."],
    ["5. Sicherheit & Meldungen", "Mitglieder können Profile melden und blockieren. Wir dürfen Inhalte entfernen und Konten sperren."],
    ["6. Kosten", "Die Nutzung von Nid Commun ist kostenlos. Sollten wir später kostenpflichtige Zusatzfunktionen anbieten, informieren wir rechtzeitig im Voraus."],
    ["7. Haftung", <P>[Haftungsregelung – von Fachperson formulieren lassen]</P>],
    ["8. Kündigung & Löschung", "Du kannst dein Konto jederzeit unter «Mein Profil» löschen."],
    ["9. Datenschutz", "Es gilt unsere Datenschutzerklärung."],
    ["10. Änderungen", "Wir informieren rechtzeitig über Änderungen dieser Bedingungen."],
    ["11. Recht & Gerichtsstand", <>Schweizer Recht. Gerichtsstand: <P>[Ort]</P></>],
  ]},
  datenschutz: { t: "Datenschutzerklärung", items: [
    ["Verantwortliche Stelle", <P>[Name der Betreiberin, Adresse, E-Mail]</P>],
    ["Welche Daten wir bearbeiten", "Kontodaten (E-Mail, Passwort verschlüsselt), Profilangaben, Kontaktanfragen, Nachrichten, Meldungen sowie technische Daten zur Nutzung."],
    ["Besonders schützenswerte Daten", "Angaben zu Geschlecht, sexueller Orientierung und Religion sind freiwillig. Wir bearbeiten sie nur mit deiner ausdrücklichen Einwilligung, und du bestimmst, wer sie sieht."],
    ["Zweck", "Betrieb der Plattform, passende Vorschläge, Sicherheit und Kommunikation zwischen Mitgliedern."],
    ["Speicherort & Dienstleister", <>Datenbank und Konten: Supabase, Rechenzentrum Zürich (AWS eu-central-2). Website-Auslieferung: <P>[Hosting-Anbieter, z. B. Netlify]</P> – dort werden keine Profildaten gespeichert.</>],
    ["Weitergabe", "Keine Weitergabe an Dritte zu Werbezwecken. Dienstleister nur soweit für den Betrieb nötig."],
    ["Aufbewahrung", <P>[Fristen festlegen, z. B. sofortige Löschung bei Kontolöschung]</P>],
    ["Deine Rechte", "Du kannst Auskunft, Berichtigung und Löschung deiner Daten verlangen. Bei Fragen kannst du dich auch an den Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) wenden."],
  ]},
};
export function Legal({ kind }) {
  const T = LEGAL[kind];
  return (
    <div className="page wrap">
      <div className="ph">
        <span className="eyebrow">Rechtliches</span>
        <h1>{T.t}</h1>
        <Note style={{ maxWidth: 760 }}>Entwurf mit Platzhaltern – vor dem Start ausfüllen und von einer Fachperson prüfen lassen.</Note>
      </div>
      <div className="legal">{T.items.map(([h, c]) => <div key={h} className="lg-i"><h4>{h}</h4><div>{c}</div></div>)}</div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="page wrap ph" style={{ minHeight: "50vh" }}>
      <span className="eyebrow">404</span><h1>Diese Seite gibt es <em className="s">nicht.</em></h1>
      <BtnLink to="/">Zur Startseite <Arr /></BtnLink>
    </div>
  );
}
