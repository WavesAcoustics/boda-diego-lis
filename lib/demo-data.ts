import type { GiftCategory, GiftWithCategory } from "@/lib/types";

export const demoCategories: GiftCategory[] = [
  {
    id: "10000000-0000-4000-8000-000000000000",
    slug: "luna-de-miel",
    name: "Luna de miel",
    description: "Experiencias para comenzar esta nueva etapa con calma, belleza y memoria.",
    sort_order: 1
  },
  {
    id: "10000000-0000-4000-8000-000000000001",
    slug: "casa",
    name: "Mudanza / casa",
    description: "Detalles útiles para nuestro primer hogar compartido.",
    sort_order: 2
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    slug: "fondo-libre",
    name: "Fondo libre",
    description: "Una aportación flexible para lo que venga después de la boda.",
    sort_order: 3
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    slug: "perritos",
    name: "Donativo a perritos",
    description: "Ayuda para apoyar refugios y rescates locales.",
    sort_order: 4
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    slug: "juguetes",
    name: "Juguetes físicos para donar",
    description: "Ideas de juguetes que puedes llevar el día de la boda.",
    sort_order: 5
  }
];

const category = (slug: string) => demoCategories.find((item) => item.slug === slug) || null;

export const demoGifts: GiftWithCategory[] = [
  {
    id: "20000000-0000-4000-8000-000000000000",
    category_id: "10000000-0000-4000-8000-000000000000",
    name: "Cena junto al mar",
    description: "Una cena tranquila para celebrar los primeros días de casados.",
    target_amount: 450000,
    contributed_amount: 120000,
    image_url: null,
    is_active: true,
    is_physical: false,
    sort_order: 1,
    gift_categories: category("luna-de-miel")
  },
  {
    id: "20000000-0000-4000-8000-000000000001",
    category_id: "10000000-0000-4000-8000-000000000000",
    name: "Hospedaje boutique",
    description: "Una noche extra en un hotel pequeño, bonito y lleno de calma.",
    target_amount: 680000,
    contributed_amount: 240000,
    image_url: null,
    is_active: true,
    is_physical: false,
    sort_order: 2,
    gift_categories: category("luna-de-miel")
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    category_id: "10000000-0000-4000-8000-000000000001",
    name: "Cafetera de casa",
    description: "Para hacer más suaves las mañanas de nuestra vida diaria.",
    target_amount: 320000,
    contributed_amount: 160000,
    image_url: null,
    is_active: true,
    is_physical: false,
    sort_order: 1,
    gift_categories: category("casa")
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    category_id: "10000000-0000-4000-8000-000000000002",
    name: "Fondo libre Diego & Lis",
    description: "Para sumar a nuestra nueva etapa con total libertad.",
    target_amount: 1000000,
    contributed_amount: 210000,
    image_url: null,
    is_active: true,
    is_physical: false,
    sort_order: 1,
    gift_categories: category("fondo-libre")
  },
  {
    id: "20000000-0000-4000-8000-000000000004",
    category_id: "10000000-0000-4000-8000-000000000003",
    name: "Croquetas y atención veterinaria",
    description: "Un donativo destinado a alimento, vacunas y cuidados para perritos rescatados.",
    target_amount: 800000,
    contributed_amount: 180000,
    image_url: null,
    is_active: true,
    is_physical: false,
    sort_order: 1,
    gift_categories: category("perritos")
  },
  {
    id: "20000000-0000-4000-8000-000000000005",
    category_id: "10000000-0000-4000-8000-000000000004",
    name: "Juguetes resistentes",
    description: "Pelotas, mordederas o juguetes lavables para llevar el día de la boda.",
    target_amount: 100,
    contributed_amount: 0,
    image_url: null,
    is_active: true,
    is_physical: true,
    sort_order: 1,
    gift_categories: category("juguetes")
  }
];
