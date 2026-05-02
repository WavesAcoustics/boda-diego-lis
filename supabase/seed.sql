insert into public.gift_categories (slug, name, description, sort_order) values
  ('luna-de-miel', 'Luna de miel', 'Experiencias para comenzar esta nueva etapa con calma, belleza y memoria.', 1),
  ('casa', 'Mudanza / casa', 'Detalles útiles para nuestro primer hogar compartido.', 2),
  ('fondo-libre', 'Fondo libre', 'Una aportación flexible para lo que venga después de la boda.', 3),
  ('perritos', 'Donativo a perritos', 'Ayuda para apoyar refugios y rescates locales.', 4),
  ('juguetes', 'Juguetes físicos para donar', 'Ideas de juguetes que puedes llevar el día de la boda.', 5)
on conflict (slug) do nothing;

insert into public.gifts (category_id, name, description, target_amount, contributed_amount, is_physical, sort_order)
select id, 'Cena junto al mar', 'Una cena tranquila para celebrar los primeros días de casados.', 450000, 120000, false, 1
from public.gift_categories where slug = 'luna-de-miel'
on conflict do nothing;

insert into public.gifts (category_id, name, description, target_amount, contributed_amount, is_physical, sort_order)
select id, 'Hospedaje boutique', 'Una noche extra en un hotel pequeño, bonito y lleno de calma.', 680000, 240000, false, 2
from public.gift_categories where slug = 'luna-de-miel'
on conflict do nothing;

insert into public.gifts (category_id, name, description, target_amount, contributed_amount, is_physical, sort_order)
select id, 'Cafetera de casa', 'Para hacer más suaves las mañanas de nuestra vida diaria.', 320000, 160000, false, 1
from public.gift_categories where slug = 'casa'
on conflict do nothing;

insert into public.gifts (category_id, name, description, target_amount, contributed_amount, is_physical, sort_order)
select id, 'Vajilla para dos y visitas', 'Una mesa sencilla, linda y lista para recibir a quienes queremos.', 520000, 80000, false, 2
from public.gift_categories where slug = 'casa'
on conflict do nothing;

insert into public.gifts (category_id, name, description, target_amount, contributed_amount, is_physical, sort_order)
select id, 'Fondo libre Diego & Lis', 'Para sumar a nuestra nueva etapa con total libertad.', 1000000, 210000, false, 1
from public.gift_categories where slug = 'fondo-libre'
on conflict do nothing;

insert into public.gifts (category_id, name, description, target_amount, contributed_amount, is_physical, sort_order)
select id, 'Croquetas y atención veterinaria', 'Un donativo destinado a alimento, vacunas y cuidados para perritos rescatados.', 800000, 180000, false, 1
from public.gift_categories where slug = 'perritos'
on conflict do nothing;

insert into public.gifts (category_id, name, description, target_amount, contributed_amount, is_physical, sort_order)
select id, 'Juguetes resistentes', 'Pelotas, mordederas o juguetes lavables para llevar el día de la boda.', 100, 0, true, 1
from public.gift_categories where slug = 'juguetes'
on conflict do nothing;
