export interface Product {
  id: string;
  variant_id: string;
  name: string;
  price: number;
  video_url: string;
  thumbnail_url?: string;
  description?: string;
  brand?: string;
  category?: string;
  created_at?: string;
}

export interface CartItem extends Product {
  line_item_id?: string;
  quantity: number;
}
