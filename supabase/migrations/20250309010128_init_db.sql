create extension if not exists "uuid-ossp";

-- Clients Table
create table if not exists public.clients (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    url text not null,
    total_users int default 0
);

-- Users Table
create table if not exists public.users (
    id uuid primary key default uuid_generate_v4(),
    email text not null,
    password text not null,
    client_id uuid not null references public.clients(id) on delete cascade
);

-- Row-Level Security (RLS)
alter table public.users enable row level security;
alter table public.clients enable row level security;