import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  // Handle Escape key & scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  const modal = {
    hidden: { opacity: 0, y: 80, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: 60, scale: 0.95, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex justify-center items-center p-4"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden max-w-2xl w-full"
        >
          {/* Image Section */}
          <div className="relative group overflow-hidden">
            <motion.img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-64 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />

            {/* Glowing Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-700 hover:text-green-600 shadow-sm transition"
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          {/* Product Content */}
          <div className="p-6 space-y-5 relative">
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.08),transparent_50%)] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />

            <motion.span
              className="text-sm font-semibold uppercase tracking-wider text-green-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {product.category}
            </motion.span>

            <motion.h2
              className="text-3xl font-bold text-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {product.productName}
            </motion.h2>

            <motion.p
              className="text-gray-600 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {product.description}
            </motion.p>

            {/* Tags */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {(product.tags?.length ? product.tags : ['Standard Grade']).map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            {/* Product Info */}
            <motion.div
              className="border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div><span className="font-semibold text-gray-700">Unit:</span> {product.unit}</div>
              <div><span className="font-semibold text-gray-700">Min. Order:</span> {product.minOrderQty} {product.unit}</div>
              <div>
                <span className="font-semibold text-gray-700">Stock:</span>{' '}
                <span
                  className={`${
                    product.stockStatus === 'In Stock'
                      ? 'text-green-600'
                      : product.stockStatus === 'Low Stock'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  } font-medium`}
                >
                  {product.stockStatus}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Price:</span>{' '}
                <a href="#/pricing" onClick={onClose} className="text-green-600 hover:underline font-semibold">
                  View Price List
                </a>
              </div>
            </motion.div>

            {/* CTA Button */}
            {/* <motion.button
              className="relative overflow-hidden bg-green-600 text-white font-semibold px-6 py-3 rounded-full mt-4 shadow-md hover:shadow-lg hover:bg-green-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('Thank you for your interest!')}
            >
              {/* <span className="relative z-10">Enquire Now</span>
              <motion.span
                className="absolute inset-0 bg-white/20 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.8 }}
              /> */}
            {/* </motion.button> */} */
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetailModal;
