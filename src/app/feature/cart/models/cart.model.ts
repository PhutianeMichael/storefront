export interface Cart {
  userId: number;
  items: CartItem[];
  subTotal: number;
  itemsCount: number;
}

export interface CartItem {
  productId: number;
  title: string;
  description: string;
  quantity: number;
  thumbnail: string;
  stock: number;
  category: string;
  sku: string;
  code: string;
  price: number;
  discountPercentage?: number;
  availabilityStatus: string;
}

export interface CartState {
  userId: number | null;
  items: CartItem[];
  total: number;
  itemCount: number;
  error: string | null;
}

export interface UserCartPayload {
  [userId: number]: Partial<CartState>;
}
