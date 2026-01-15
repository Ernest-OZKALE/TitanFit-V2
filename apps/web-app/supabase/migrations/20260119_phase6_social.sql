-- Create Posts table for Real Social Feed
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  image_url text,
  likes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.posts enable row level security;

-- Policies
create policy "Public posts are viewable by everyone." on public.posts for select using (true);
create policy "Users can insert their own posts." on public.posts for insert with check (auth.uid() = user_id);
create policy "Users can update their own posts." on public.posts for update using (auth.uid() = user_id);

-- Create Likes table (Optional but better for real count)
create table if not exists public.post_likes (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;
create policy "Public likes viewable" on public.post_likes for select using (true);
create policy "Auth users can like" on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Auth users can unlike" on public.post_likes for delete using (auth.uid() = user_id);

-- Add points column to profiles if missing (for Leaderboard)
alter table public.profiles add column if not exists points integer default 0;
alter table public.profiles add column if not exists workout_streak integer default 0;
