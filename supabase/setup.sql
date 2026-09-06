-- Run this once in the Supabase SQL Editor to set up the poll.

create table if not exists poll_options (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  order_index int not null
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  option_id uuid not null references poll_options(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table poll_options enable row level security;
alter table votes enable row level security;

create policy "poll_options are publicly readable"
  on poll_options for select
  using (true);

create policy "votes are publicly readable"
  on votes for select
  using (true);

create policy "anyone can cast a vote"
  on votes for insert
  with check (true);

-- Lets the live results page get instant updates when a new vote comes in.
alter publication supabase_realtime add table votes;

-- The poll options. Edit these labels any time in the Table Editor.
insert into poll_options (label, order_index) values
  ('Ancient Egypt', 1),
  ('Ancient Rome', 2),
  ('Medieval Europe', 3),
  ('The Renaissance', 4),
  ('The Wild West', 5),
  ('The Roaring 20s', 6);
