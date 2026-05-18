create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'counselor')),
  created_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);