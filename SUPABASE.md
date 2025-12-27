# Supabase Setup

## 1) Environment variables

Create a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 2) Enable Google auth

In the Supabase dashboard:
- Authentication > Providers > Google: enable it.
- Add the OAuth client ID/secret from Google Cloud.
- Authentication > URL Configuration: add redirect URLs for local/dev and prod.

## 3) SQL schema + RLS policies

Run the SQL below in the Supabase SQL editor:

```sql
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create table if not exists friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  friend_id uuid references auth.users on delete cascade not null,
  status text not null check (status in ('pending', 'accepted')),
  created_at timestamptz default now(),
  check (user_id <> friend_id)
);

create unique index if not exists friendships_unique_pair on friendships (user_id, friend_id);
create index if not exists friendships_friend_idx on friendships (friend_id);

alter table friendships enable row level security;

create policy "Friendships are readable by participants"
  on friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can send friend requests"
  on friendships for insert
  with check (auth.uid() = user_id);

create policy "Participants can update friendships"
  on friendships for update
  using (auth.uid() = user_id or auth.uid() = friend_id)
  with check (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Participants can delete friendships"
  on friendships for delete
  using (auth.uid() = user_id or auth.uid() = friend_id);

create table if not exists poop_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  type smallint not null check (type between 1 and 7),
  notes text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz default now()
);

create index if not exists poop_logs_user_idx on poop_logs (user_id, occurred_at desc);

alter table poop_logs enable row level security;

create policy "Users can insert their own logs"
  on poop_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can read their own and friends' logs"
  on poop_logs for select
  using (
    auth.uid() = user_id
    or exists (
      select 1
      from friendships f
      where f.status = 'accepted'
        and (
          (f.user_id = auth.uid() and f.friend_id = poop_logs.user_id)
          or (f.friend_id = auth.uid() and f.user_id = poop_logs.user_id)
        )
    )
  );

create policy "Users can update their own logs"
  on poop_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own logs"
  on poop_logs for delete
  using (auth.uid() = user_id);
```

## 4) Notes

- Friends can see each other's logs after the request is accepted.
- Profile records are upserted on sign-in.
