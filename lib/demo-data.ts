import type { GiftCategory, GiftWithCategory } from "@/lib/types";

export const demoCategories: GiftCategory[] = [
  {
    id: "10000000-0000-4000-8000-000000000000",
    slug: "surprise",
    name: "SORPRESA",
    description: "Un espacio abierto para regalos creativos y mensajes personalizados.",
    sort_order: 1
  },
  {
    id: "10000000-0000-4000-8000-000000000001",
    slug: "honeymoon",
    name: "Luna de miel",
    description: "Regalos para vivir nuestro primer viaje como esposos en Peru.",
    sort_order: 2
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    slug: "experiences",
    name: "Experiencias",
    description: "Planes para seguir creando recuerdos juntos.",
    sort_order: 3
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    slug: "home",
    name: "Casa",
    description: "Detalles utiles para nuestro primer hogar.",
    sort_order: 4
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    slug: "perritos",
    name: "Donativo a perritos",
    description: "Ayuda para alimento, juguetes y cuidado de animales rescatados.",
    sort_order: 5
  }
];

const category = (slug: string) => demoCategories.find((item) => item.slug === slug) || null;

export const demoGifts: GiftWithCategory[] = [
  {
    id: "20000000-0000-4000-8000-000000000000",
    category_id: "10000000-0000-4000-8000-000000000000",
    name: "¡Sorpréndenos!",
    description:
      "Este es tu espacio para ponerte creativo. Nos encantan las sorpresas, así que déjate llevar... Si decides regalarnos algo desde aquí, cuéntanos en el mensaje en qué te gustaría que usemos ese dinero.",
    target_amount: 25000000,
    contributed_amount: 0,
    image_url: "/images/gifts/mystery-box.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 1,
    gift_categories: category("surprise")
  },
  {
    id: "20000000-0000-4000-8000-000000000001",
    category_id: "10000000-0000-4000-8000-000000000001",
    name: "Vuelos para la luna de miel",
    description:
      "¡Todos abordo! Acompáñanos en esta aventura que será nuestro primer viaje como esposos. Queremos ir a Perú para que Lis me presente a su abuela y primos que no podrán venir a la boda. Y me enseñe esa cultura. Lima, Ica, Nazca están en la lista.",
    target_amount: 4000000,
    contributed_amount: 0,
    image_url: "/images/gifts/vuelos-luna-de-miel.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 2,
    gift_categories: category("honeymoon")
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    category_id: "10000000-0000-4000-8000-000000000001",
    name: "Noches en Lima",
    description:
      "Nos queremos quedar en Nhow, un hotel súper ecléctico que mezcla la modernidad con la cultura inca, como ejemplo: hay una llama con una llama encendida en su estómago.",
    target_amount: 700000,
    contributed_amount: 0,
    image_url: "/images/gifts/nhow-lima.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 3,
    gift_categories: category("honeymoon")
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    category_id: "10000000-0000-4000-8000-000000000001",
    name: "Fondo para ceviche",
    description: "¡¿Cómo no??! Ustedes también lo harían.",
    target_amount: 50000,
    contributed_amount: 0,
    image_url: "/images/gifts/ceviche-peruano.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 4,
    gift_categories: category("honeymoon")
  },
  {
    id: "20000000-0000-4000-8000-000000000004",
    category_id: "10000000-0000-4000-8000-000000000001",
    name: "Fondo para museos",
    description:
      "Se redujo la lista porque Lis tenía una gigante, tenemos dos obligatorios al que ir: MAC y MATE.",
    target_amount: 50000,
    contributed_amount: 0,
    image_url: "/images/gifts/museo-larco.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 5,
    gift_categories: category("honeymoon")
  },
  {
    id: "20000000-0000-4000-8000-000000000005",
    category_id: "10000000-0000-4000-8000-000000000001",
    name: "Fondo para Pisco Sour",
    description:
      "Víctor Morris, un bartender, en su bar en Lima en 1916 experimentó con pisco y jugo de limón... inventando una bebida que Diego aún no prueba.",
    target_amount: 50000,
    contributed_amount: 0,
    image_url: "/images/gifts/morris-bar.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 6,
    gift_categories: category("honeymoon")
  },
  {
    id: "20000000-0000-4000-8000-000000000006",
    category_id: "10000000-0000-4000-8000-000000000002",
    name: "Escapada de fin de semana",
    description:
      "Una mini pausa para salir de la rutina, conocer un lugar cercano y regalarnos tiempo juntos cuando la vida vuelva a tomar ritmo.",
    target_amount: 200000,
    contributed_amount: 0,
    image_url: "/images/gifts/escapada-fin-de-semana.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 7,
    gift_categories: category("experiences")
  },
  {
    id: "20000000-0000-4000-8000-000000000007",
    category_id: "10000000-0000-4000-8000-000000000002",
    name: "Noche de concierto o teatro",
    description:
      "Un regalo para salir, arreglarnos y vivir una noche cultural juntos. Más que un boleto, es una excusa para seguir creando recuerdos. Tipo en noviembre con A Perfect Circle.",
    target_amount: 500000,
    contributed_amount: 0,
    image_url: "/images/gifts/concierto-teatro.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 8,
    gift_categories: category("experiences")
  },
  {
    id: "20000000-0000-4000-8000-000000000008",
    category_id: "10000000-0000-4000-8000-000000000003",
    name: "Ninja Thirsti",
    description:
      "Algo que quizás no compraríamos por nuestra cuenta, pero sí apreciaríamos mucho, y podríamos organizar una cata de refrescos hechos en casa.",
    target_amount: 470000,
    contributed_amount: 0,
    image_url: "/images/gifts/ninja-thirsti.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 9,
    gift_categories: category("home")
  },
  {
    id: "20000000-0000-4000-8000-000000000009",
    category_id: "10000000-0000-4000-8000-000000000003",
    name: "Lavavajillas Xpert Wash",
    description: "Un regalo útil de verdad: menos tiempo lavando platos y más tiempo disfrutando.",
    target_amount: 1500000,
    contributed_amount: 0,
    image_url: "/images/gifts/lavavajillas-xpert-wash.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 10,
    gift_categories: category("home")
  },
  {
    id: "20000000-0000-4000-8000-000000000010",
    category_id: "10000000-0000-4000-8000-000000000003",
    name: "Shark Steam & Scrub S8201",
    description: "Artillería pesada de la limpieza para pisos.",
    target_amount: 650000,
    contributed_amount: 0,
    image_url: "/images/gifts/shark-steam-scrub.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 11,
    gift_categories: category("home")
  },
  {
    id: "20000000-0000-4000-8000-000000000011",
    category_id: "10000000-0000-4000-8000-000000000003",
    name: "Fondo para nuestro primer hogar",
    description:
      "Aportación simbólica y práctica para armar poco a poco, un espacio propio. Muebles, detalles, útiles y decisiones inteligentes para empezar bien.",
    target_amount: 450000,
    contributed_amount: 0,
    image_url: "/images/gifts/primer-hogar.jpg",
    is_active: true,
    is_physical: false,
    sort_order: 12,
    gift_categories: category("home")
  },
  {
    id: "20000000-0000-4000-8000-000000000012",
    category_id: "10000000-0000-4000-8000-000000000004",
    name: "Donativo para animales callejeros",
    description:
      "Aportación destinada a comida, juguetes y apoyo para 31 gatitos y señoras que rescatan perritos.",
    target_amount: 1500000,
    contributed_amount: 0,
    image_url: null,
    is_active: true,
    is_physical: false,
    sort_order: 13,
    gift_categories: category("perritos")
  }
];
