-- Communities Table
create table if not exists public.communities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  members_count integer default 1,
  category text,
  is_private boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Challenges Table
create table if not exists public.challenges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  goal text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  reward_points integer default 100,
  participants_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Challenges (Progress)
create table if not exists public.user_challenges (
  user_id uuid references public.profiles(id) on delete cascade,
  challenge_id uuid references public.challenges(id) on delete cascade,
  progress integer default 0, -- 0-100
  status text default 'active', -- active, completed
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, challenge_id)
);

-- Insert Default Real Data (Seeding) to avoid empty page
insert into public.communities (name, description, category, members_count)
values 
('Club Force Paris', 'Pour les passionnés de Powerlifting', 'Force', 42),
('Runners IDF', 'Sorties running le dimanche', 'Cardio', 15)
on conflict do nothing;

insert into public.challenges (name, description, goal, reward_points, start_date, end_date)
values
('Titan Month', '20 séances ce mois-ci', '20 Séances', 500, now(), now() + interval '30 days'),
('Protein King', '150g protéines / jour pendant 1 semaine', 'Nutrition', 300, now(), now() + interval '7 days')
on conflict do nothing;

-- Enable RLS
alter table public.communities enable row level security;
alter table public.challenges enable row level security;
alter table public.user_challenges enable row level security;

create policy "Communities are viewable by everyone" on public.communities for select using (true);
create policy "Challenges are viewable by everyone" on public.challenges for select using (true);
create policy "User challenges viewable by owner" on public.user_challenges for select using (auth.uid() = user_id);
create policy "Users can join challenges" on public.user_challenges for insert with check (auth.uid() = user_id);
