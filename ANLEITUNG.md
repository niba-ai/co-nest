# Nid Commun online stellen – Schritt für Schritt

Diese Anleitung ist für Menschen ohne Programmiererfahrung geschrieben.
Du brauchst etwa **45 Minuten** und **kein Geld**.

Du richtest drei kostenlose Dienste ein:

| Dienst | Wofür | Wo liegen die Daten? |
|---|---|---|
| **GitHub** | Speichert den Programmcode | – |
| **Supabase** | Datenbank, Konten, Chat | Rechenzentrum **Zürich** |
| **Netlify** | Zeigt die Website im Internet an | Nur der Code, keine Nutzerdaten |

---

## Schritt 1 – Code auf GitHub

*(Falls Claude den Code schon in dein GitHub-Repository hochgeladen hat, überspringe diesen Schritt.)*

1. Gehe auf **github.com** und melde dich an (oder erstelle ein kostenloses Konto).
2. Klicke oben rechts auf **+** → **New repository**.
3. Name: `co-nest` · Sichtbarkeit: **Private** · dann **Create repository**.
4. Klicke auf **uploading an existing file**.
5. Entpacke die ZIP-Datei auf deinem Computer. Ziehe **den Inhalt** des Ordners `co-nest`
   (nicht den Ordner selbst) in das Browserfenster.
6. Unten auf **Commit changes** klicken.

---

## Schritt 2 – Datenbank bei Supabase (Zürich)

1. Gehe auf **supabase.com** → **Start your project** → mit GitHub anmelden.
2. Klicke auf **New project**.
   - **Name:** `nid-commun`
   - **Database Password:** auf «Generate a password» klicken und das Passwort **sicher aufbewahren**
     (z. B. in einem Passwort-Manager).
   - **Region:** **Central Europe (Zurich)** ← wichtig!
   - Plan: **Free**
3. **Create new project** – warte 1–2 Minuten.
4. Links im Menü auf **SQL Editor** klicken → **New query**.
5. Öffne die Datei `supabase/schema.sql` aus diesem Projekt, kopiere **den ganzen Text** und füge ihn ein.
6. Unten rechts auf **Run** klicken. Es sollte «Success» erscheinen.

✅ Jetzt gibt es alle Tabellen und Sicherheitsregeln.

---

## Schritt 3 – Die zwei Schlüssel notieren

In Supabase:

1. Links unten auf **Project Settings** (Zahnrad).
2. Unter **Data API** (oder **API**) findest du die **Project URL** – z. B. `https://abcd1234.supabase.co`.
3. Unter **API Keys** findest du den **anon / public key** (bei neuen Projekten heisst er
   **publishable key** und beginnt mit `sb_publishable_`).

Beide Werte brauchst du gleich. ⚠️ Den **service_role / secret key** **niemals** verwenden oder weitergeben.

---

## Schritt 4 – Website bei Netlify veröffentlichen

1. Gehe auf **netlify.com** → **Sign up** → **mit GitHub anmelden**.
2. **Add new site** → **Import an existing project** → **GitHub**.
3. Wähle das Repository `co-nest` (bzw. `nid-commun`, falls du es umbenannt hast) aus (evtl. musst du Netlify den Zugriff erlauben).
4. Die Einstellungen werden automatisch erkannt (Build command `npm run build`, Publish directory `dist`).
5. Klicke auf **Add environment variables** und trage ein:

   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | deine Project URL aus Schritt 3 |
   | `VITE_SUPABASE_ANON_KEY` | dein anon / publishable key aus Schritt 3 |

6. **Deploy** klicken. Nach 1–2 Minuten ist die Seite online, z. B. unter
   `https://zufaelliger-name.netlify.app`.
7. Unter **Site configuration → Change site name** kannst du die Adresse ändern, z. B. in
   `nidcommun.netlify.app` (falls noch frei).

---

## Schritt 5 – Supabase mit der Website verbinden

Damit die Bestätigungs-E-Mails auf deine Website zurückführen:

1. In Supabase: **Authentication** → **URL Configuration**.
2. **Site URL:** deine Netlify-Adresse eintragen, z. B. `https://nidcommun.netlify.app`
3. **Redirect URLs** → **Add URL:** `https://nidcommun.netlify.app/**`
4. Speichern.

*(Optional)* Unter **Authentication → Emails** kannst du die Texte der E-Mails auf Deutsch übersetzen.

---

## Schritt 6 – Testen

1. Öffne deine Website und registriere dich mit deiner E-Mail.
2. Bestätige den Link in der E-Mail und fülle dein Profil aus.
3. Registriere ein zweites Konto (andere E-Mail-Adresse), sende eine Kontaktanfrage, nimm sie an
   und schreibt euch Nachrichten.

🎉 Fertig – Nid Commun ist online!

---

## Gut zu wissen

**Meldungen ansehen:** In Supabase → **Table Editor** → Tabelle `reports`. Dort siehst du alle Meldungen.
Ein Konto sperren: **Authentication → Users** → Benutzer auswählen → **Ban user** oder **Delete user**.

**Grenzen der Gratis-Versionen (Stand: bitte bei den Anbietern prüfen):**
- Supabase pausiert Gratis-Projekte, wenn sie längere Zeit (ca. 1 Woche) nicht benutzt werden.
  Du kannst sie im Dashboard mit einem Klick wieder starten. Sobald Nid Commun regelmässig genutzt wird, passiert das nicht.
- Supabase verschickt mit dem eingebauten E-Mail-Dienst nur **wenige E-Mails pro Stunde**.
  Für den richtigen Start einen eigenen E-Mail-Dienst einrichten (Authentication → Emails → SMTP Settings),
  z. B. mit einer E-Mail-Adresse deiner eigenen Domain.

**Datenschutz:** Die Datenbank liegt in Zürich. Supabase ist aber ein US-Unternehmen und nutzt
Amazon Web Services. Erwähne das in der Datenschutzerklärung und schliesse den
Auftragsverarbeitungsvertrag (DPA) von Supabase ab. Lass die Rechtstexte vor dem Start prüfen.

**Änderungen an der Website:** Jede Änderung, die auf GitHub hochgeladen wird, veröffentlicht Netlify automatisch.

**Eigene Domain (später):** z. B. `nidcommun.ch` bei einem Schweizer Anbieter kaufen (ca. CHF 10–20/Jahr),
dann in Netlify unter **Domain management** hinzufügen und in Supabase (Schritt 5) die Adresse anpassen.

---

## Für Entwicklerinnen und Entwickler

```bash
cp .env.example .env      # Werte eintragen
npm install
npm run dev               # http://localhost:5173
```

- React 18 + Vite, React Router, `@supabase/supabase-js`
- Datenbank-Schema und Row-Level-Security: `supabase/schema.sql`
- Matching-Logik: `src/match.js`
