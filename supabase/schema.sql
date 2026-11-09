-- =====================================================================
--  Nid Commun – Datenbank
--  Diesen gesamten Text im Supabase "SQL Editor" einfügen und auf "Run"
--  klicken. Er legt alle Tabellen und Sicherheitsregeln an.
--  Man kann ihn gefahrlos mehrmals ausführen.
-- =====================================================================

-- ---------- Profile (für alle angemeldeten Mitglieder sichtbar) ----------
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  first_name    text not null check (char_length(first_name) between 1 and 60),
  birth_year    int  not null,
  canton        text not null,
  city          text check (char_length(city) <= 60),
  role          text not null,
  constellation text not null default 'einzeln',
  model         text not null default 'offen' check (model in ('gleich','flex','offen')),
  split         int  not null default 4 check (split between 0 and 4),
  side          text not null default 'gross' check (side in ('gross','klein')),
  kids          text not null default 'keine' check (kids in ('keine','eins','mehrere')),
  about         text check (char_length(about) <= 1500),
  job           text check (char_length(job) <= 80),
  workload      text,
  housing       text,
  languages     text check (char_length(languages) <= 120),
  rel_edu       text,
  diet          text,
  school        text,
  media         text,
  is_complete   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Erlaubte Werte (auch bei bereits bestehender Tabelle aktualisieren)
alter table public.profiles add column if not exists constellation text not null default 'einzeln';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('mutter','vater','elternteil','bezug'));
alter table public.profiles drop constraint if exists profiles_constellation_check;
alter table public.profiles add constraint profiles_constellation_check
  check (constellation in ('einzeln','paar','gruppe'));

-- Mindestalter 18 Jahre
create or replace function public.check_profile_age() returns trigger
language plpgsql as $$
begin
  if extract(year from now())::int - new.birth_year < 18 then
    raise exception 'Mitglieder müssen mindestens 18 Jahre alt sein.';
  end if;
  if new.birth_year < 1940 then
    raise exception 'Bitte ein gültiges Geburtsjahr angeben.';
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists profiles_age on public.profiles;
create trigger profiles_age before insert or update on public.profiles
  for each row execute function public.check_profile_age();

-- ---------- Besonders schützenswerte Angaben (freiwillig) ----------
create table if not exists public.profile_sensitive (
  user_id     uuid primary key references public.profiles (id) on delete cascade,
  gender      text,
  orientation text,
  religion    text,
  visibility  text not null default 'contacts'
              check (visibility in ('contacts','members','private'))
);

-- ---------- Kontaktanfragen ----------
create table if not exists public.contact_requests (
  id           uuid primary key default gen_random_uuid(),
  from_id      uuid not null references public.profiles (id) on delete cascade,
  to_id        uuid not null references public.profiles (id) on delete cascade,
  message      text check (char_length(message) <= 1000),
  status       text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  unique (from_id, to_id),
  check (from_id <> to_id)
);

-- ---------- Nachrichten ----------
create table if not exists public.messages (
  id          bigint generated always as identity primary key,
  sender_id   uuid not null references public.profiles (id) on delete cascade,
  receiver_id uuid not null references public.profiles (id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 4000),
  created_at  timestamptz not null default now(),
  read_at     timestamptz
);
create index if not exists messages_pair on public.messages (sender_id, receiver_id, created_at);

-- ---------- Blockieren & Melden ----------
create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reported_id uuid not null references public.profiles (id) on delete cascade,
  reason      text not null,
  details     text check (char_length(details) <= 2000),
  created_at  timestamptz not null default now()
);

-- ---------- Hilfsfunktionen ----------
create or replace function public.is_blocked_between(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.blocks
    where (blocker_id = a and blocked_id = b) or (blocker_id = b and blocked_id = a)
  );
$$;

create or replace function public.are_contacts(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.contact_requests
    where status = 'accepted'
      and ((from_id = a and to_id = b) or (from_id = b and to_id = a))
  ) and not public.is_blocked_between(a, b);
$$;

-- Eigenes Konto vollständig löschen
create or replace function public.delete_my_account() returns void
language sql security definer set search_path = public as $$
  delete from auth.users where id = auth.uid();
$$;

-- ---------- Sicherheitsregeln (Row Level Security) ----------
alter table public.profiles          enable row level security;
alter table public.profile_sensitive enable row level security;
alter table public.contact_requests  enable row level security;
alter table public.messages          enable row level security;
alter table public.blocks            enable row level security;
alter table public.reports           enable row level security;

-- Profile: nur für angemeldete Mitglieder, nie für Blockierte
drop policy if exists "profiles lesen" on public.profiles;
create policy "profiles lesen" on public.profiles for select to authenticated
  using (id = auth.uid() or (is_complete and not public.is_blocked_between(auth.uid(), id)));
drop policy if exists "profil anlegen" on public.profiles;
create policy "profil anlegen" on public.profiles for insert to authenticated
  with check (id = auth.uid());
drop policy if exists "profil ändern" on public.profiles;
create policy "profil ändern" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Sensible Angaben: je nach Sichtbarkeits-Einstellung
drop policy if exists "sensibel lesen" on public.profile_sensitive;
create policy "sensibel lesen" on public.profile_sensitive for select to authenticated
  using (
    user_id = auth.uid()
    or (not public.is_blocked_between(auth.uid(), user_id) and (
          visibility = 'members'
          or (visibility = 'contacts' and public.are_contacts(auth.uid(), user_id))))
  );
drop policy if exists "sensibel anlegen" on public.profile_sensitive;
create policy "sensibel anlegen" on public.profile_sensitive for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists "sensibel ändern" on public.profile_sensitive;
create policy "sensibel ändern" on public.profile_sensitive for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Kontaktanfragen: nur die beiden Beteiligten
drop policy if exists "anfragen lesen" on public.contact_requests;
create policy "anfragen lesen" on public.contact_requests for select to authenticated
  using ((from_id = auth.uid() or to_id = auth.uid())
         and not public.is_blocked_between(from_id, to_id));
drop policy if exists "anfrage senden" on public.contact_requests;
create policy "anfrage senden" on public.contact_requests for insert to authenticated
  with check (from_id = auth.uid() and status = 'pending'
              and not public.is_blocked_between(from_id, to_id));
drop policy if exists "anfrage beantworten" on public.contact_requests;
create policy "anfrage beantworten" on public.contact_requests for update to authenticated
  using (to_id = auth.uid())
  with check (to_id = auth.uid() and status in ('accepted','declined'));
-- Beim Beantworten dürfen nur Status und Zeitpunkt geändert werden
revoke update on public.contact_requests from authenticated;
grant update (status, responded_at) on public.contact_requests to authenticated;

-- Nachrichten: nur zwischen bestätigten Kontakten
drop policy if exists "nachrichten lesen" on public.messages;
create policy "nachrichten lesen" on public.messages for select to authenticated
  using ((sender_id = auth.uid() or receiver_id = auth.uid())
         and not public.is_blocked_between(sender_id, receiver_id));
drop policy if exists "nachricht senden" on public.messages;
create policy "nachricht senden" on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and public.are_contacts(sender_id, receiver_id));
drop policy if exists "nachricht gelesen" on public.messages;
create policy "nachricht gelesen" on public.messages for update to authenticated
  using (receiver_id = auth.uid()) with check (receiver_id = auth.uid());
revoke update on public.messages from authenticated;
grant update (read_at) on public.messages to authenticated;

-- Blockieren: nur eigene Einträge
drop policy if exists "blocks lesen" on public.blocks;
create policy "blocks lesen" on public.blocks for select to authenticated
  using (blocker_id = auth.uid());
drop policy if exists "blockieren" on public.blocks;
create policy "blockieren" on public.blocks for insert to authenticated
  with check (blocker_id = auth.uid());
drop policy if exists "entblocken" on public.blocks;
create policy "entblocken" on public.blocks for delete to authenticated
  using (blocker_id = auth.uid());

-- Meldungen: nur senden. Lesen kann nur das Nid Commun-Team im Supabase-Dashboard.
drop policy if exists "melden" on public.reports;
create policy "melden" on public.reports for insert to authenticated
  with check (reporter_id = auth.uid());

-- Nicht angemeldete Besucher haben keinen Zugriff
revoke all on public.profiles, public.profile_sensitive, public.contact_requests,
              public.messages, public.blocks, public.reports from anon;
revoke execute on function public.delete_my_account() from anon, public;
grant execute on function public.delete_my_account() to authenticated;

-- ---------- Live-Aktualisierung für Chat und Anfragen ----------
do $$
begin
  begin
    alter publication supabase_realtime add table public.messages;
  exception when duplicate_object then null; when undefined_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.contact_requests;
  exception when duplicate_object then null; when undefined_object then null;
  end;
end $$;
