begin;

-- Limpieza segura para desarrollo:
-- 1. Borra pagos de prueba que siguen pendientes.
-- 2. Oculta regalos anteriores para que no se dupliquen en la página pública.
delete from public.payment_events
where contribution_id in (
  select id from public.contributions where status = 'pending'
);

delete from public.contributions
where status = 'pending';

update public.gifts
set is_active = false;

insert into public.gift_categories (slug, name, description, sort_order) values
  ('honeymoon', 'Luna de miel', 'Regalos para vivir y recordar nuestra primera gran aventura como esposos.', 1),
  ('experiences', 'Experiencias', 'Planes y momentos para seguir celebrando después de la boda.', 2),
  ('home', 'Casa', 'Detalles útiles para construir un hogar cómodo, lindo y funcional.', 3),
  ('life_fund', 'Fondos de vida', 'Aportaciones prácticas para comenzar esta etapa con más tranquilidad.', 4),
  ('fun_extras', 'Extras divertidos', 'Detalles ligeros, memorables y muy nuestros.', 5),
  ('perritos', 'Donativo a perritos', 'Ayuda para alimento, juguetes y cuidado de animales rescatados.', 6)
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
    ('honeymoon', 'Vuelos para la luna de miel', 'Aportación para acercarnos al destino de nuestra primera gran aventura como esposos. Este regalo nos ayuda a convertir el viaje en realidad desde el primer despegue.', 45000, 0, 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80', true, false, 1),
    ('honeymoon', 'Noches de hotel frente al mar', 'Contribución para hospedarnos en un lugar especial, descansar después de la boda y empezar esta etapa con calma, vista bonita y tiempo de calidad.', 35000, 0, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', true, false, 2),
    ('honeymoon', 'Upgrade de habitación especial', 'Un detalle para hacer más memorable la luna de miel: una mejor habitación, una vista más bonita o una noche con un toque extra de celebración.', 12000, 0, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', true, false, 3),
    ('honeymoon', 'Cena especial de luna de miel', 'Una cena tranquila para celebrar sin prisa, brindar por lo vivido y guardar una noche bonita como uno de nuestros primeros recuerdos de casados.', 4500, 0, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80', true, false, 4),
    ('honeymoon', 'Tour privado para descubrir el destino', 'Una experiencia para conocer algo único del lugar: caminar, explorar, probar comida local y regresar con una historia que podamos contar siempre.', 6000, 0, 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', true, false, 5),
    ('honeymoon', 'Spa en pareja', 'Un momento para bajar revoluciones después de tantos preparativos y disfrutar juntos un espacio de descanso, silencio y consentirnos un poco.', 5000, 0, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', true, false, 6),
    ('honeymoon', 'Traslados y renta de coche', 'Ayuda práctica para movernos con libertad durante el viaje: aeropuertos, trayectos al hotel y pequeñas escapadas sin complicaciones.', 9000, 0, 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80', true, false, 7),
    ('experiences', 'Cena degustación de aniversario', 'Un regalo pensado para el futuro: una cena especial para recordar nuestro primer aniversario y mantener viva la tradición de celebrar lo importante.', 6500, 0, 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80', true, false, 8),
    ('experiences', 'Escapada de fin de semana', 'Una mini pausa para salir de la rutina, conocer un lugar cercano y regalarnos tiempo juntos cuando la vida vuelva a tomar ritmo.', 10000, 0, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', true, false, 9),
    ('experiences', 'Clase de cocina para dos', 'Una experiencia sencilla y divertida para aprender algo nuevo juntos, cocinar, reírnos y llevarnos una receta que podamos repetir en casa.', 3500, 0, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80', true, false, 10),
    ('experiences', 'Cata de vino y quesos', 'Un plan para disfrutar una tarde distinta, probar sabores nuevos y compartir un momento relajado con buena conversación.', 4200, 0, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80', true, false, 11),
    ('experiences', 'Noche de concierto o teatro', 'Un regalo para salir, arreglarnos y vivir una noche cultural juntos. Más que un boleto, es una excusa para seguir creando recuerdos.', 5000, 0, 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80', true, false, 12),
    ('experiences', 'Sesión de fotos de pareja', 'Una sesión tranquila para conservar esta etapa con fotos bonitas, naturales y sin la presión del día de la boda.', 7000, 0, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', true, false, 13),
    ('home', 'Set de maletas de calidad', 'Maletas resistentes para la luna de miel, futuras escapadas y la vida que queremos construir viajando juntos con más orden y menos estrés.', 18000, 0, 'https://images.unsplash.com/photo-1553531384-411a247ccd73?auto=format&fit=crop&w=1200&q=80', true, false, 14),
    ('home', 'Cafetera espresso para casa', 'Para convertir las mañanas normales en un pequeño ritual: café rico, conversación tranquila y una casa que se sienta cada vez más nuestra.', 16000, 0, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80', true, false, 15),
    ('home', 'Aspiradora robot', 'Un regalo útil de verdad: menos tiempo limpiando y más tiempo disfrutando la casa, los planes y los domingos sin pendientes.', 11000, 0, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80', true, false, 16),
    ('home', 'Batería de cocina premium', 'Una base duradera para cocinar bien en casa, desde cenas sencillas entre semana hasta comidas especiales con familia y amigos.', 9500, 0, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80', true, false, 17),
    ('home', 'Vajilla completa para recibir', 'Una vajilla bonita y resistente para empezar nuestra casa con intención y poder recibir a la gente que queremos alrededor de la mesa.', 8500, 0, 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1200&q=80', true, false, 18),
    ('home', 'Ropa de cama tipo hotel', 'Sábanas y blancos de buena calidad para que nuestra habitación se sienta cómoda, fresca y lista para descansar bien.', 6500, 0, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', true, false, 19),
    ('home', 'Kit de cuchillos y tabla de cocina', 'Un básico bien elegido para cocinar mejor, más seguro y con herramientas que duren muchos años.', 4500, 0, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=1200&q=80', true, false, 20),
    ('home', 'Bocina o soundbar para la sala', 'Para disfrutar películas, música y noches en casa con mejor sonido, sin que tenga que ser un lujo innecesario.', 9000, 0, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80', true, false, 21),
    ('life_fund', 'Fondo para nuestro primer hogar', 'Aportación simbólica y práctica para armar poco a poco un espacio propio: muebles, detalles útiles y decisiones inteligentes para empezar bien.', 25000, 0, 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80', true, false, 22),
    ('life_fund', 'Fondo para renta y depósito inicial', 'Un regalo con impacto real: ayuda para cubrir gastos importantes de instalación y darnos más tranquilidad en los primeros meses.', 30000, 0, 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80', true, false, 23),
    ('life_fund', 'Fondo de emergencias como pareja', 'Una aportación para empezar con más seguridad financiera, pensando en imprevistos, estabilidad y decisiones con menos presión.', 20000, 0, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80', true, false, 24),
    ('life_fund', 'Fondo para muebles esenciales', 'Para comprar solo lo necesario y hacerlo bien: piezas útiles, duraderas y pensadas para una casa funcional, no para llenar espacio sin sentido.', 18000, 0, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', true, false, 25),
    ('fun_extras', 'Desayuno post-boda', 'Para despertar al día siguiente con calma, comer rico y revivir juntos los mejores momentos de la fiesta.', 3000, 0, 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80', true, false, 26),
    ('fun_extras', 'Fondo para sobremesas de domingo', 'Un regalo sencillo para seguir reuniéndonos, pedir algo rico, cocinar o armar esos planes que terminan siendo los más memorables.', 2500, 0, 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80', true, false, 27),
    ('fun_extras', 'Tacos de desvelo', 'Porque después de una gran celebración siempre se agradece un plan sencillo, divertido y muy nuestro: tacos, risas y cero formalidad.', 1800, 0, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80', true, false, 28),
    ('fun_extras', 'Brindis especial de luna de miel', 'Una botella o brindis bonito para celebrar con intención el inicio de esta nueva etapa, sin complicarlo de más.', 2200, 0, 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80', true, false, 29),
    ('perritos', 'Donativo para animales callejeros', 'Aportación destinada a comida, juguetes y apoyo para 31 gatitos y señoras que rescatan perritos.', 15000, 0, null, true, false, 30)
) as gifts(slug, name, description, target_amount_pesos, contributed_amount_pesos, image_url, is_active, is_physical, sort_order)
join public.gift_categories categories on categories.slug = gifts.slug;

commit;
