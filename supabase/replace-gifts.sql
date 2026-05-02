begin;

-- Limpieza segura:
-- 1. Borra pagos que siguen pendientes.
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
  ('honeymoon', 'Luna de miel', 'Regalos para vivir nuestro primer viaje como esposos en Perú.', 2),
  ('experiences', 'Experiencias', 'Planes para seguir creando recuerdos juntos.', 3),
  ('home', 'Casa', 'Detalles útiles para nuestro primer hogar.', 4),
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
    ('surprise', '¡Sorpréndenos!', 'Este es tu espacio para ponerte creativo. Nos encantan las sorpresas, así que déjate llevar… Si decides regalarnos algo desde aquí, cuéntanos en el mensaje en qué te gustaría que usemos ese dinero.', 1000, 0, '/images/gifts/mystery-box.jpg', true, false, 1),
    ('honeymoon', 'Vuelos para la luna de miel', '¡Todos abordo! Acompáñanos en esta aventura que será nuestro primer viaje como esposos. Queremos ir a Perú para que Lis me presente a su abuela y primos que no podrán venir a la boda, y para que me enseñe esa cultura. Lima, Ica y Nazca están en la lista.', 40000, 0, '/images/gifts/vuelos-luna-de-miel.jpg', true, false, 2),
    ('honeymoon', 'Noches en Lima', 'Nos queremos quedar en Nhow, un hotel súper ecléctico que mezcla la modernidad con la cultura inca. Como ejemplo: hay una llama con una llama encendida en su estómago.', 7000, 0, '/images/gifts/nhow-lima.jpg', true, false, 3),
    ('honeymoon', 'Fondo para ceviche', '¡¿Cómo no?! Ustedes también lo harían.', 500, 0, '/images/gifts/ceviche-peruano.jpg', true, false, 4),
    ('honeymoon', 'Fondo para museos', 'Se redujo la lista porque Lis tenía una gigante. Tenemos dos obligatorios: MAC y MATE.', 500, 0, '/images/gifts/museo-larco.jpg', true, false, 5),
    ('honeymoon', 'Fondo para Pisco Sour', 'Víctor Morris, un bartender, en su bar en Lima en 1916 experimentó con pisco y jugo de limón… inventando una bebida que Diego aún no prueba.', 500, 0, '/images/gifts/morris-bar.jpg', true, false, 6),
    ('experiences', 'Escapada de fin de semana', 'Una mini pausa para salir de la rutina, conocer un lugar cercano y regalarnos tiempo juntos cuando la vida vuelva a tomar ritmo.', 2000, 0, '/images/gifts/escapada-fin-de-semana.jpg', true, false, 7),
    ('experiences', 'Noche de concierto o teatro', 'Un regalo para salir, arreglarnos y vivir una noche cultural juntos. Más que un boleto, es una excusa para seguir creando recuerdos. Tipo en noviembre con A Perfect Circle.', 5000, 0, '/images/gifts/concierto-teatro.jpg', true, false, 8),
    ('home', 'Ninja Thirsti', 'Algo que quizás no compraríamos por nuestra cuenta, pero sí apreciaríamos mucho. Además, podríamos organizar una cata de refrescos hechos en casa.', 4700, 0, '/images/gifts/ninja-thirsti.jpg', true, true, 9),
    ('home', 'Lavavajillas Xpert Wash', 'Un regalo útil de verdad: menos tiempo lavando platos y más tiempo disfrutando.', 15000, 0, '/images/gifts/lavavajillas-xpert-wash.jpg', true, true, 10),
    ('home', 'Shark Steam & Scrub S8201', 'Artillería pesada de la limpieza para pisos.', 6500, 0, '/images/gifts/shark-steam-scrub.jpg', true, true, 11),
    ('home', 'Fondo para nuestro primer hogar', 'Aportación simbólica y práctica para armar poco a poco un espacio propio. Muebles, detalles útiles y decisiones inteligentes para empezar bien.', 250000, 0, '/images/gifts/primer-hogar.jpg', true, false, 12),
    ('honeymoon', 'Ruta Lima–Ica–Nazca', 'Para movernos por Perú y conocer más que solo Lima. Queremos que este viaje tenga paisajes, carretera, comida, cultura y esas historias que se cuentan mil veces después.', 6000, 0, 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', true, false, 13),
    ('honeymoon', 'Visita a la familia de Lis', 'Este viaje también es para que Diego conozca a la abuela y primos de Lis que no podrán venir a la boda. Un regalo con muchísimo valor emocional para los dos.', 3500, 0, 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80', true, false, 14),
    ('honeymoon', 'Cena peruana especial', 'Una cena bonita en Lima para que Lis le enseñe a Diego por qué Perú se toma tan en serio su comida. Spoiler: probablemente Diego va a querer repetir.', 2500, 0, 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80', true, false, 15),
    ('honeymoon', 'Tour gastronómico en Lima', 'Para probar ceviche, causa, anticuchos, postres y todo lo que Lis diga que “sí o sí tienes que probar”.', 2000, 0, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80', true, false, 16),
    ('honeymoon', 'Día de aventura en Huacachina', 'Un día para salir de lo normal: dunas, desierto, fotos, arena en lugares raros y una experiencia que seguro vamos a recordar.', 3000, 0, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', true, false, 17),
    ('honeymoon', 'Souvenirs con historia', 'Queremos traernos algo pequeño pero especial de Perú: no cosas por comprar, sino algún detalle que recuerde este primer viaje como esposos.', 1500, 0, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80', true, false, 18),
    ('experiences', 'Primera cita oficial de casados', 'Para salir después de la boda ya sin pendientes, sin Excel de invitados, sin proveedores y sin presión. Solo nosotros dos celebrando que ya pasó todo.', 2000, 0, 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80', true, false, 19),
    ('experiences', 'Domingo sin cocinar', 'Un regalo simple pero poderoso: pedir algo rico, ver una película y descansar como se debe después de semanas de boda, trabajo y caos.', 900, 0, 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80', true, false, 20),
    ('experiences', 'Clase de cocina peruano-mexicana', 'Para aprender a cocinar algo que mezcle nuestras historias: un poco de Perú, un poco de México y mucho intento de no quemar nada.', 2500, 0, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80', true, false, 21),
    ('experiences', 'Fin de semana de desconexión', 'Una escapada corta para apagar el modo pendientes y encender el modo esposos. Cerca, sencillo, pero necesario.', 4000, 0, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', true, false, 22),
    ('home', 'Maletas buenas para viajar', 'Para la luna de miel y para todos los viajes que vengan después. De esos regalos que no parecen románticos hasta que los necesitas.', 7500, 0, 'https://images.unsplash.com/photo-1553531384-411a247ccd73?auto=format&fit=crop&w=1200&q=80', true, true, 23),
    ('home', 'Ropa de cama rica', 'Para que nuestra cama se sienta como hotel, pero sin tener que hacer check-out. Sábanas buenas, descanso real y cero arrepentimiento.', 4000, 0, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', true, true, 24),
    ('home', 'Toallas de adulto responsable', 'Toallas buenas, grandes y suaves. Porque llega un momento en la vida en que esto se vuelve un lujo necesario.', 2500, 0, 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80', true, true, 25),
    ('home', 'Kit de herramientas básico', 'Para armar, colgar, ajustar, arreglar y sentir que sabemos lo que estamos haciendo aunque estemos viendo tutoriales.', 2000, 0, 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=80', true, true, 26),
    ('home', 'Organizadores para la casa', 'Para empezar nuestra vida juntos sin que todo termine en “luego lo acomodamos”. Cajas, separadores, cajones y paz mental.', 2000, 0, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80', true, true, 27),
    ('home', 'Sillas cómodas para trabajar', 'Para esos días largos frente a la computadora en los que una buena silla sí hace diferencia. Regalo cero cursi, pero muy agradecido.', 5000, 0, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80', true, true, 28),
    ('home', 'Purificador de aire', 'Para tener una casa más cómoda, limpia y agradable. Un regalo útil, discreto y de esos que se agradecen todos los días.', 4500, 0, 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=1200&q=80', true, true, 29),
    ('home', 'Primer súper de casados', 'Para llenar la casa por primera vez con lo básico, lo rico y probablemente demasiados snacks “por si acaso”.', 3000, 0, 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80', true, false, 30),
    ('home', 'Batería de cocina de buena calidad', 'Para cocinar bien sin tener diez ollas malas ocupando espacio. Algo útil, duradero y que sí vamos a usar.', 6500, 0, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80', true, true, 31),
    ('home', 'Set de cuchillos y tabla', 'Un básico bien elegido para cocinar mejor, más seguro y con herramientas que duren muchos años.', 3500, 0, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=1200&q=80', true, true, 32),
    ('home', 'Vajilla para recibir', 'Una vajilla bonita y resistente para empezar nuestra casa con intención y poder recibir a la gente que queremos alrededor de la mesa.', 5000, 0, 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1200&q=80', true, true, 33),
    ('home', 'Copas para brindar', 'Para los brindis grandes, pequeños y los que se inventan sin razón. Un detalle bonito para celebrar en casa.', 2800, 0, 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80', true, true, 34),
    ('home', 'Lámparas para ambiente', 'Para que la casa se sienta más cálida, bonita y nuestra. La iluminación correcta cambia todo.', 3200, 0, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80', true, true, 35),
    ('home', 'Fondo para detalles del primer hogar', 'Para comprar esos detalles que hacen que una casa se sienta hogar: lámparas, textiles, organizadores, decoración útil y cosas que iremos eligiendo juntos.', 250000, 0, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', true, false, 36),
    ('perritos', 'Donativo para animales callejeros', 'Aportación destinada a comida, juguetes y apoyo para 31 gatitos y señoras que rescatan perritos.', 15000, 0, null, true, false, 37)
) as gifts(slug, name, description, target_amount_pesos, contributed_amount_pesos, image_url, is_active, is_physical, sort_order)
join public.gift_categories categories on categories.slug = gifts.slug;


commit;
