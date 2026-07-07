export interface Team {
  name: string;
  countryCode: string;
  flag: string;
  stillInCompetition: boolean;
  stage?: string; // e.g. "Quarter-Finals", "Semi-Finals", "Group Stage"
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
}
