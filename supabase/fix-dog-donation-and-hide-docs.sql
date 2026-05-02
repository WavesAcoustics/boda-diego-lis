begin;

insert into public.gift_categories (slug, name, description, sort_order) values
  ('perritos', 'Donativo a perritos', 'Ayuda para alimento, juguetes y cuidado de animales rescatados.', 6)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

update public.gifts
set is_active = false
where lower(name) = 'fondo para documentos y trámites';

insert into public.gifts (
  category_id,
  name,
  description,
  target_amount,
  contributed_amount,
  image_url,
  is_active,
  is_physical,
  sort_order
)
select
  category.id,
  'Donativo para animales callejeros',
  'Aportación destinada a comida, juguetes y apoyo para 31 gatitos y señoras que rescatan perritos.',
  1500000,
  0,
  null,
  true,
  false,
  30
from public.gift_categories category
where category.slug = 'perritos'
and not exists (
  select 1
  from public.gifts existing
  where lower(existing.name) = 'donativo para animales callejeros'
);

update public.gifts
set is_active = true,
  is_physical = false
where lower(name) = 'donativo para animales callejeros';

commit;
