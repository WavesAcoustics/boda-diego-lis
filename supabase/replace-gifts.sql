begin;

-- Limpieza segura para desarrollo/produccion:
-- 1. Borra pagos de prueba que siguen pendientes.
-- 2. Oculta regalos anteriores para que no se dupliquen en la pagina publica.
delete from public.payment_events
where contribution_id in (
  select id from public.contributions where status = 'pending'
);

delete from public.contributions
where status = 'pending';

update public.gifts
set is_active = false;

insert into public.gift_categories (slug, name, description, sort_order) values
  ('surprise', 'SORPRESA', 'Un espacio abierto para regalos creativos y mensajes personalizados.', 1),
  ('honeymoon', 'Luna de miel', 'Regalos para vivir nuestro primer viaje como esposos en Peru.', 2),
  ('experiences', 'Experiencias', 'Planes para seguir creando recuerdos juntos.', 3),
  ('home', 'Casa', 'Detalles utiles para nuestro primer hogar.', 4),
  ('perritos', 'Donativo a perritos', 'Ayuda para alimento, juguetes y cuidado de animales rescatados.', 5)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

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
  categories.id,
  gifts.name,
  gifts.description,
  gifts.target_amount_pesos * 100,
  gifts.contributed_amount_pesos * 100,
  gifts.image_url,
  gifts.is_active,
  gifts.is_physical,
  gifts.sort_order
from (
  values
    (
      'surprise',
      '¡Sorpréndenos!',
      'Este es tu espacio para ponerte creativo. Nos encantan las sorpresas, así que déjate llevar... Si decides regalarnos algo desde aquí, cuéntanos en el mensaje en qué te gustaría que usemos ese dinero.',
      250000,
      0,
      '/images/gifts/mystery-box.jpg',
      true,
      false,
      1
    ),
    (
      'honeymoon',
      'Vuelos para la luna de miel',
      '¡Todos abordo! Acompáñanos en esta aventura que será nuestro primer viaje como esposos. Queremos ir a Perú para que Lis me presente a su abuela y primos que no podrán venir a la boda. Y me enseñe esa cultura. Lima, Ica, Nazca están en la lista.',
      40000,
      0,
      '/images/gifts/vuelos-luna-de-miel.jpg',
      true,
      false,
      2
    ),
    (
      'honeymoon',
      'Noches en Lima',
      'Nos queremos quedar en Nhow, un hotel súper ecléctico que mezcla la modernidad con la cultura inca, como ejemplo: hay una llama con una llama encendida en su estómago.',
      7000,
      0,
      '/images/gifts/nhow-lima.jpg',
      true,
      false,
      3
    ),
    (
      'honeymoon',
      'Fondo para ceviche',
      '¡¿Cómo no??! Ustedes también lo harían.',
      500,
      0,
      '/images/gifts/ceviche-peruano.jpg',
      true,
      false,
      4
    ),
    (
      'honeymoon',
      'Fondo para museos',
      'Se redujo la lista porque Lis tenía una gigante, tenemos dos obligatorios al que ir: MAC y MATE.',
      500,
      0,
      '/images/gifts/museo-larco.jpg',
      true,
      false,
      5
    ),
    (
      'honeymoon',
      'Fondo para Pisco Sour',
      'Víctor Morris, un bartender, en su bar en Lima en 1916 experimentó con pisco y jugo de limón... inventando una bebida que Diego aún no prueba.',
      500,
      0,
      '/images/gifts/morris-bar.jpg',
      true,
      false,
      6
    ),
    (
      'experiences',
      'Escapada de fin de semana',
      'Una mini pausa para salir de la rutina, conocer un lugar cercano y regalarnos tiempo juntos cuando la vida vuelva a tomar ritmo.',
      2000,
      0,
      '/images/gifts/escapada-fin-de-semana.jpg',
      true,
      false,
      7
    ),
    (
      'experiences',
      'Noche de concierto o teatro',
      'Un regalo para salir, arreglarnos y vivir una noche cultural juntos. Más que un boleto, es una excusa para seguir creando recuerdos. Tipo en noviembre con A Perfect Circle.',
      5000,
      0,
      '/images/gifts/concierto-teatro.jpg',
      true,
      false,
      8
    ),
    (
      'home',
      'Ninja Thirsti',
      'Algo que quizás no compraríamos por nuestra cuenta, pero sí apreciaríamos mucho, y podríamos organizar una cata de refrescos hechos en casa.',
      4700,
      0,
      '/images/gifts/ninja-thirsti.jpg',
      true,
      false,
      9
    ),
    (
      'home',
      'Lavavajillas Xpert Wash',
      'Un regalo útil de verdad: menos tiempo lavando platos y más tiempo disfrutando.',
      15000,
      0,
      '/images/gifts/lavavajillas-xpert-wash.jpg',
      true,
      false,
      10
    ),
    (
      'home',
      'Shark Steam & Scrub S8201',
      'Artillería pesada de la limpieza para pisos.',
      6500,
      0,
      '/images/gifts/shark-steam-scrub.jpg',
      true,
      false,
      11
    ),
    (
      'home',
      'Fondo para nuestro primer hogar',
      'Aportación simbólica y práctica para armar poco a poco, un espacio propio. Muebles, detalles, útiles y decisiones inteligentes para empezar bien.',
      4500,
      0,
      '/images/gifts/primer-hogar.jpg',
      true,
      false,
      12
    ),
    (
      'perritos',
      'Donativo para animales callejeros',
      'Aportación destinada a comida, juguetes y apoyo para 31 gatitos y señoras que rescatan perritos.',
      15000,
      0,
      null,
      true,
      false,
      13
    )
) as gifts(slug, name, description, target_amount_pesos, contributed_amount_pesos, image_url, is_active, is_physical, sort_order)
join public.gift_categories categories on categories.slug = gifts.slug;

commit;
