import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../services/googleSheetService';

type NewProductData = Omit<Product, 'productId' | 'lastUpdated'>;

interface ProductContextType {
  products: Product[];
  addProduct: (product: NewProductData) => void;
  updateProduct: (productId: string, updatedData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const addProduct = (productData: NewProductData) => {
    const newProduct: Product = {
      ...productData,
      productId: 'PROD' + new Date().getTime(),
      lastUpdated: new Date().toISOString().split('T')[0],
      imageUrl: productData.imageUrl || `https://source.unsplash.com/400x300/?${encodeURIComponent(productData.productName)}`,
    };
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const updateProduct = (productId: string, updatedData: Partial<Product>) => {
    setProducts(prevProducts =>
      prevProducts.map(p => p.productId === productId ? { ...p, ...updatedData, lastUpdated: new Date().toISOString().split('T')[0] } : p)
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.productId !== productId));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
