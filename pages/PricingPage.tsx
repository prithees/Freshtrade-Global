import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/productService';
import { Product } from '../types';
import { CURRENCY_RATES, CURRENCY_SYMBOLS } from '../constants';

type Currency = keyof typeof CURRENCY_RATES;

const PricingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>('SGD');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);
  
  const handleDownloadCSV = () => {
    const headers = ['Product ID', 'Category', 'Product Name', 'Unit', `Price (${currency})`, 'Min Order Qty', 'Stock Status'];
    const rows = products.map(p => [
      p.productId,
      p.category,
      p.productName,
      p.unit,
      (p.pricePerUnit * CURRENCY_RATES[currency]).toFixed(2),
      p.minOrderQty,
      p.stockStatus
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `freshtrade_pricelist_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStockColor = (status: Product['stockStatus']) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Daily Pricing</h1>
        <p className="text-lg text-gray-600 mt-2">Prices updated daily. All prices are per unit as specified.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <label htmlFor="currency" className="mr-2 text-sm font-medium">Currency:</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            {Object.keys(CURRENCY_RATES).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button
            onClick={handleDownloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors text-sm font-semibold"
        >
          Download Price List (CSV)
        </button>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price / Unit</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min. Order</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-10 text-gray-500">Loading prices...</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.productId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {CURRENCY_SYMBOLS[currency]}{(product.pricePerUnit * CURRENCY_RATES[currency]).toFixed(2)}
                    <span className="text-gray-500 font-normal"> / {product.unit}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.minOrderQty} {product.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockColor(product.stockStatus)}`}>
                      {product.stockStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingPage;
