create table if not exists public.letters (
  id uuid primary key,
  text text not null check (char_length(text) between 1 and 4000),
  reply_to uuid references public.letters(id),
  status text not null default 'waiting'
    check (status in ('waiting','claimed','answered')),
  created_at timestamptz not null default now(),
  claimed_at timestamptz,
  answered_at timestamptz
);

create index if not exists letters_waiting_idx
  on public.letters(status, created_at);

alter table public.letters enable row level security;

create or replace function public.claim_next_letter()
returns table(id uuid, text text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with picked as (
    select l.id
    from public.letters l
    where l.status = 'waiting'
    order by l.created_at asc
    for update skip locked
    limit 1
  )
  update public.letters l
  set status = 'claimed', claimed_at = now()
  from picked
  where l.id = picked.id
  returning l.id, l.text, l.created_at;
end;
$$;

create or replace function public.reply_to_letter(
  p_parent_id uuid,
  p_text text,
  p_new_id uuid
)
returns table(id uuid)
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.letters
  set status = 'answered', answered_at = now()
  where public.letters.id = p_parent_id
    and public.letters.status = 'claimed';

  if not found then
    return;
  end if;

  insert into public.letters(id, text, reply_to, status)
  values (p_new_id, p_text, p_parent_id, 'waiting');

  return query select p_new_id;
end;
$$;
