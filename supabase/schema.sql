-- Выполните в Supabase: SQL Editor → New query → Run
-- Базовая схема для кабинета клиента ГК Рубкофф (MVP)

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  contract_number text not null unique,
  phone_normalized text not null,
  full_name text not null,
  object_address text not null,
  current_stage smallint not null default 1 check (current_stage between 1 and 8),
  manager_name text,
  manager_phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.site_photos (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  storage_path text not null,
  taken_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Фото для кабинета (URL публичного объекта в Storage bucket "photo")
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  url text not null,
  caption text,
  uploaded_at timestamptz not null default now()
);

create index if not exists photos_client_uploaded_idx
  on public.photos (client_id, uploaded_at desc);

-- Storage: bucket для файлов (выполните один раз)
insert into storage.buckets (id, name, public)
values ('photo', 'photo', true)
on conflict (id) do update set public = excluded.public;

-- Публичное чтение файлов из bucket photo (загрузка идёт с сервера через service_role)
drop policy if exists "photos_public_read" on storage.objects;
drop policy if exists "photo_public_read" on storage.objects;
create policy "photo_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'photo');

-- Если в проекте включён RLS на clients без политик для роли anon,
-- запросы с NEXT_PUBLIC_SUPABASE_ANON_KEY будут отклоняться.
-- В Next.js для админки и серверных чтений используйте SUPABASE_SERVICE_ROLE_KEY
-- (см. .env.local.example) — только на сервере, никогда в браузере.

-- Опционально для локальной отладки без service_role (не для продакшена):
-- alter table public.clients disable row level security;
