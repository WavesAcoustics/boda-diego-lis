create extension if not exists pgcrypto;

create type payment_status as enum ('pending', 'approved', 'rejected', 'refunded');

create table public.gift_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.gift_categories(id) on delete cascade,
  name text not null,
  description text not null,
  target_amount integer not null check (target_amount > 0),
  contributed_amount integer not null default 0 check (contributed_amount >= 0),
  image_url text,
  is_active boolean not null default true,
  is_physical boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  companions integer not null default 0 check (companions >= 0 and companions <= 10),
  dietary_restrictions text,
  will_attend boolean not null,
  created_at timestamptz not null default now()
);

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.gifts(id) on delete restrict,
  contributor_name text not null,
  contributor_email text not null,
  message text,
  amount integer not null check (amount > 0),
  status payment_status not null default 'pending',
  external_reference text not null unique,
  mp_preference_id text,
  mp_payment_id text unique,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  mp_payment_id text not null unique,
  contribution_id uuid references public.contributions(id) on delete set null,
  event_type text not null,
  status payment_status not null,
  raw_payload jsonb not null,
  created_at timestamptz not null default now()
);

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger gifts_touch_updated_at
before update on public.gifts
for each row execute function public.touch_updated_at();

create trigger contributions_touch_updated_at
before update on public.contributions
for each row execute function public.touch_updated_at();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create or replace function public.increment_gift_contribution(
  gift_id_input uuid,
  amount_input integer
)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.gifts
  set contributed_amount = greatest(0, least(target_amount, contributed_amount + amount_input))
  where id = gift_id_input;
end;
$$;

revoke execute on function public.increment_gift_contribution(uuid, integer) from public;
revoke execute on function public.increment_gift_contribution(uuid, integer) from anon;
revoke execute on function public.increment_gift_contribution(uuid, integer) from authenticated;
grant execute on function public.increment_gift_contribution(uuid, integer) to service_role;

alter table public.gift_categories enable row level security;
alter table public.gifts enable row level security;
alter table public.guests enable row level security;
alter table public.contributions enable row level security;
alter table public.payment_events enable row level security;
alter table public.admin_users enable row level security;

create policy "Public can read categories"
on public.gift_categories for select
using (true);

create policy "Public can read active gifts"
on public.gifts for select
using (is_active = true or public.is_admin());

create policy "Admins manage categories"
on public.gift_categories for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins manage gifts"
on public.gifts for all
using (public.is_admin())
with check (public.is_admin());

create policy "Guests can submit RSVP"
on public.guests for insert
with check (true);

create policy "Admins read RSVPs"
on public.guests for select
using (public.is_admin());

create policy "Admins read contributions"
on public.contributions for select
using (public.is_admin());

create policy "Admins read payment events"
on public.payment_events for select
using (public.is_admin());

create policy "Admins read admin users"
on public.admin_users for select
using (public.is_admin());

create index gifts_category_sort_idx on public.gifts(category_id, sort_order);
create index contributions_status_idx on public.contributions(status);
create index guests_created_at_idx on public.guests(created_at desc);
