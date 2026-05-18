insert into public.profiles (id, username, role)
select id, coalesce(raw_user_meta_data->>'name', email), 'user'
from auth.users
where not exists (
  select 1 from public.profiles where profiles.id = auth.users.id
);