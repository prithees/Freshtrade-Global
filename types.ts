
export interface Product {
  productId: string;
  category: string;
  productName: string;
  imageUrl: string;
  unit: string;
  pricePerUnit: number;
  minOrderQty: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
  description: string;
  tags: string[];
}
