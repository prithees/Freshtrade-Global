import React, { useState, useMemo } from 'react';
import { Heart, Search } from 'lucide-react';
import { Product } from '../types';
import ProductDetailModal from '../components/ProductDetailModal';
import { useProducts } from '../context/ProductContext';
import Lottie from 'lottie-react';
import { AnimatePresence, motion } from 'framer-motion';
import emptyBox from './assets/empty.json'; // optional animation

// 💚 Animated Product Card
const ProductCard: React.FC<{
  product: Product;
  onClick: () => void;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
}> = ({ product, onClick, isFavorite, toggleFavorite }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer group relative border border-gray-100 dark:border-gray-700"
    onClick={onClick}
    whileHover={{ scale: 1.04, rotateY: 2 }}
    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
  >
    {/* Favorite button */}
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(product.productId);
      }}
      className="absolute top-3 right-3 bg-white dark:bg-gray-700 rounded-full p-2 shadow hover:bg-green-100 dark:hover:bg-green-700 transition-all z-10"
      whileTap={{ scale: 0.8 }}
    >
      <Heart
        className={`h-5 w-5 ${
          isFavorite
            ? 'fill-green-500 text-green-500 animate-pulse'
            : 'text-gray-400'
        }`}
      />
    </motion.button>

    {/* Image */}
    <div className="relative overflow-hidden">
      <motion.img
        className="h-52 w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        src={product.imageUrl}
        alt={product.productName}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
    </div>

    {/* Info */}
    <div className="p-4">
      <span className="text-xs text-green-600 font-semibold uppercase">
        {product.category}
      </span>
      <h3 className="text-lg font-semibold mt-1 mb-2 text-gray-800 dark:text-gray-100">
        {product.productName}
      </h3>
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-500">{product.unit}</span>
        <motion.span
          className="text-sm font-medium text-green-500 group-hover:text-green-600"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          View Details →
        </motion.span>
      </div>
    </div>
  </motion.div>
);

const ProductsPage: React.FC = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Hero / Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white py-20 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold tracking-tight">
            Discover Our Fresh Products
          </h1>
          <p className="mt-3 text-lg opacity-90">
            Hand-picked produce from trusted farms across the globe.
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-2 bg-white/10"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <motion.div
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative flex-grow w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <motion.input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full border text-sm font-medium relative overflow-hidden transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-green-500 text-white border-green-500 shadow-lg'
                  : 'border-gray-300 text-gray-700 hover:bg-green-100'
              }`}
              whileHover={{
                scale: 1.1,
                boxShadow:
                  selectedCategory === category
                    ? '0 0 15px rgba(34,197,94,0.7)'
                    : '0 0 8px rgba(34,197,94,0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          <AnimatePresence>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                    isFavorite={favorites.includes(product.productId)}
                    toggleFavorite={toggleFavorite}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full flex flex-col items-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Lottie animationData={emptyBox} loop className="w-48 h-48" />
                <p className="text-gray-600 mt-6 text-lg">
                  No products found matching your search.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 10 }}
          >
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductsPage;
