export type GiftCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Gift = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  target_amount: number;
  contributed_amount: number;
  image_url: string | null;
  is_active: boolean;
  is_physical: boolean;
  sort_order: number;
};

export type GiftWithCategory = Gift & {
  gift_categories: GiftCategory | null;
};

export type AdminContribution = {
  id: string;
  contributor_name: string;
  contributor_email: string;
  message: string | null;
  amount: number;
  status: "pending" | "approved" | "rejected" | "refunded";
  created_at: string;
  approved_at: string | null;
  gifts: { name: string } | null;
};

export type Guest = {
  id: string;
  name: string;
  companions: number;
  dietary_restrictions: string | null;
  will_attend: boolean;
  created_at: string;
};
