export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  description?: string;
  image?: string;
  created_at?: string;
}

export interface CreatePropertyDto {
  title: string;
  price: number;
  location: string;
  description?: string;
  image?: string;
}
