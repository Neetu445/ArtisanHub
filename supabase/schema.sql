-- ArtisanHub schema. Paste into Supabase SQL Editor and run once.
create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  role text not null check (role in ('artisan','customer')),
  created_at timestamptz default now()
);

create table if not exists artisans (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users on delete set null,
  name text not null, craft text, location text,
  avatar text, cover text, years_exp int default 1,
  story text default '', process text default '',
  rating numeric default 0, reviews int default 0,
  created_at timestamptz default now()
);

create table if not exists products (
  id text primary key default gen_random_uuid()::text,
  artisan_id text references artisans on delete cascade,
  name text not null, category text, material text,
  price int not null default 0, stock int not null default 0, low_stock int default 5,
  image text, description text, description_hi text, tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists orders (
  id text primary key default gen_random_uuid()::text,
  customer_id uuid references auth.users on delete set null,
  artisan_id text references artisans on delete cascade,
  type text not null check (type in ('regular','custom')),
  product_id text references products on delete set null,
  qty int default 1, amount int default 0, status text not null, address text,
  title text, brief text, reference_image text, quote jsonb,
  created_at timestamptz default now()
);

create table if not exists messages (
  id text primary key default gen_random_uuid()::text,
  order_id text references orders on delete cascade,
  sender_id uuid references auth.users on delete set null,
  text text not null,
  created_at timestamptz default now()
);

-- auto-create profile + artisan row on signup
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare r text;
begin
  r := coalesce(new.raw_user_meta_data->>'role','customer');
  insert into public.profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name','User'), r)
  on conflict (id) do nothing;
  if r = 'artisan' then
    insert into public.artisans (user_id, name, craft, location, avatar, cover)
    values (new.id, coalesce(new.raw_user_meta_data->>'name','Artisan'), coalesce(new.raw_user_meta_data->>'craft','Handicraft'),
            coalesce(new.raw_user_meta_data->>'location','India'),
            '/img/default-avatar.jpg', '/img/default-cover.jpg');
  end if;
  return new;
exception when others then
  raise warning 'handle_new_user failed: %', sqlerrm;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- stock decrement helper (atomic)
create or replace function public.decrement_stock(pid text, q int) returns void language sql security definer set search_path = public as $$
  update public.products set stock = stock - q where id = pid and stock >= q;
$$;

-- Row Level Security (hackathon-level: public read, authenticated write)
alter table profiles enable row level security;
alter table artisans enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table messages enable row level security;

create policy "read profiles" on profiles for select using (true);
create policy "read artisans" on artisans for select using (true);
create policy "read products" on products for select using (true);
create policy "read orders" on orders for select to authenticated using (true);
create policy "read messages" on messages for select to authenticated using (true);

create policy "write artisans" on artisans for all to authenticated using (true) with check (true);
create policy "write products" on products for all to authenticated using (true) with check (true);
create policy "write orders" on orders for all to authenticated using (true) with check (true);
create policy "write messages" on messages for all to authenticated using (true) with check (true);

-- realtime
alter publication supabase_realtime add table orders, messages, products;

-- storage buckets
insert into storage.buckets (id, name, public) values ('images','images', true) on conflict do nothing;
create policy "public read images" on storage.objects for select using (bucket_id = 'images');
create policy "auth upload images" on storage.objects for insert to authenticated with check (bucket_id = 'images');
