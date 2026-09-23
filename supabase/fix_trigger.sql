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

