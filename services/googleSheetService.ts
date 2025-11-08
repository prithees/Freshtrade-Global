
import { Product } from '../types';
import { GOOGLE_SHEET_URL } from '../constants';

// NOTE FOR DEVELOPERS:
// This service currently fetches data from a public Google Sheet.
// For a production environment with a database (like MongoDB), you would
// replace the `fetchProducts` implementation with API calls to your backend.
// Example:
//
// import axios from 'axios';
// const API_URL = 'https://your-backend.com/api/products';
//
// export const fetchProducts = async (): Promise<Product[]> => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch products from API:", error);
//     return []; // Or handle error appropriately
//   }
// };
//
// You would also add functions for creating, updating, and deleting products:
// export const addProduct = async (productData) => axios.post(API_URL, productData);
// export const updateProduct = async (id, productData) => axios.put(`${API_URL}/${id}`, productData);
// export const deleteProduct = async (id) => axios.delete(`${API_URL}/${id}`);


export const MOCK_PRODUCTS: Product[] = [
  {
    productId: 'VEG001',
    category: 'Vegetables',
    productName: 'Onion',
    imageUrl: `https://source.unsplash.com/400x300/?fresh-onions`,
    unit: 'kg',
    pricePerUnit: 40,
    minOrderQty: 50,
    stockStatus: 'In Stock',
    lastUpdated: '2024-05-20',
    description: 'Fresh, pungent red onions, sourced from the best farms in Nashik. Perfect for a wide range of culinary applications.',
    tags: ['Nashik Origin', 'A-Grade', 'Staple'],
  },
  {
    productId: 'VEG002',
    category: 'Vegetables',
    productName: 'Tomato',
    imageUrl: `https://source.unsplash.com/400x300/?ripe-tomatoes`,
    unit: 'kg',
    pricePerUnit: 30,
    minOrderQty: 50,
    stockStatus: 'In Stock',
    lastUpdated: '2024-05-20',
    description: 'Juicy, ripe tomatoes with a vibrant red color. Ideal for salads, sauces, and curries.',
    tags: ['Hybrid', 'A-Grade'],
  },
  {
    productId: 'VEG003',
    category: 'Vegetables',
    productName: 'Garlic',
    imageUrl: `https://source.unsplash.com/400x300/?garlic-bulbs`,
    unit: 'kg',
    pricePerUnit: 120,
    minOrderQty: 20,
    stockStatus: 'Low Stock',
    lastUpdated: '2024-05-20',
    description: 'Aromatic and flavorful garlic bulbs. An essential ingredient for adding depth to any dish.',
    tags: ['Organic', 'Pungent'],
  },
  {
    productId: 'FRU001',
    category: 'Fruits',
    productName: 'Apple',
    imageUrl: `https://source.unsplash.com/400x300/?red-apples`,
    unit: 'kg',
    pricePerUnit: 150,
    minOrderQty: 25,
    stockStatus: 'In Stock',
    lastUpdated: '2024-05-20',
    description: 'Crisp and sweet Royal Gala apples, sourced from Himachal Pradesh. Perfect for fresh consumption or baking.',
    tags: ['Royal Gala', 'Premium'],
  },
  {
    productId: 'FRU002',
    category: 'Fruits',
    productName: 'Mango',
    imageUrl: `https://source.unsplash.com/400x300/?ripe-mangoes`,
    unit: 'dozen',
    pricePerUnit: 800,
    minOrderQty: 10,
    stockStatus: 'In Stock',
    lastUpdated: '2024-05-20',
    description: 'Sweet and fragrant Alphonso mangoes, the king of fruits. Sourced from the Konkan region.',
    tags: ['Alphonso', 'Seasonal', 'Export Quality'],
  },
  {
    productId: 'EXO001',
    category: 'Exotic',
    productName: 'Avocado',
    imageUrl: `https://source.unsplash.com/400x300/?fresh-avocado`,
    unit: 'piece',
    pricePerUnit: 180,
    minOrderQty: 30,
    stockStatus: 'Out of Stock',
    lastUpdated: '2024-05-19',
    description: 'Creamy and nutritious Hass avocados, imported for superior quality.',
    tags: ['Imported', 'Hass'],
  },
];


const parseCSV = (csvText: string): Product[] => {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const products: Product[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    
    // Robust CSV parsing to handle commas within quoted fields.
    // This regex splits by comma only if it's not inside quotes.
    const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
                         .map(v => v.trim().replace(/^"|"$/g, ''));

    const productData: any = {};
    headers.forEach((header, index) => {
      productData[header] = values[index];
    });

    if (!productData.product_id || !productData.product_name) continue;

    products.push({
      productId: productData.product_id,
      category: productData.category || 'Uncategorized',
      productName: productData.product_name,
      imageUrl: productData.image_url || `https://source.unsplash.com/400x300/?${productData.product_name.toLowerCase().replace(' ', '-')}`,
      unit: productData.unit || 'unit',
      pricePerUnit: parseFloat(productData.price_per_unit) || 0,
      minOrderQty: parseInt(productData.min_order_qty, 10) || 1,
      stockStatus: (productData.stock_status as Product['stockStatus']) || 'In Stock',
      lastUpdated: productData.last_updated || new Date().toISOString().split('T')[0],
      description: productData.description || 'High-quality, freshly sourced produce.',
      tags: productData.tags ? productData.tags.split(';').map((t: string) => t.trim()) : [],
    });
  }
  return products;
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    const parsedProducts = parseCSV(csvText);
    // If sheet is empty or parsing fails, return mock data
    return parsedProducts.length > 0 ? parsedProducts : MOCK_PRODUCTS;
  } catch (error) {
    console.error("Failed to fetch or parse product data, returning mock data:", error);
    return MOCK_PRODUCTS;
  }
};
