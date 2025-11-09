"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Heart, Search, Sparkles, Filter } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Lottie from "lottie-react"
import emptyBox from "./assets/empty1.json"
import ProductDetailModal from "../components/ProductDetailModal"
import type { Product } from "../types"

const API_URL = "http://localhost:4000/api/products"

// 💚 Animated Product Card Component
const ProductCard: React.FC<{
  product: Product
  productIndex: number
  onClick: () => void
  isFavorite: boolean
  toggleFavorite: (index: number) => void
}> = ({ product, productIndex, onClick, isFavorite, toggleFavorite }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer group relative border border-gray-100 dark:border-gray-700 transition-all hover:shadow-lg"
    onClick={onClick}
    whileHover={{ scale: 1.04, rotateY: 2 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
  >
    {/* Favorite Button */}
    <motion.button
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(productIndex)
      }}
      className="absolute top-3 right-3 bg-white dark:bg-gray-700 rounded-full p-2 shadow hover:bg-green-100 dark:hover:bg-green-700 transition-all z-10"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.8 }}
    >
      <Heart
        className={`h-5 w-5 transition-all ${
          isFavorite ? "fill-red-500 text-red-500 animate-pulse" : "text-gray-400 hover:text-red-500"
        }`}
      />
    </motion.button>

    {/* Product Image */}
    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700">
      <motion.img
        className="h-52 w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        src={product.imageUrl}
        alt={product.productName}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {isFavorite && (
        <motion.div
          className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          ♥ Liked
        </motion.div>
      )}
    </div>

    <div className="p-4">
      <span className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">
        {product.category || "Uncategorized"}
      </span>
      <h3 className="text-lg font-semibold mt-1 mb-2 text-gray-800 dark:text-gray-100 line-clamp-2">
        {product.productName}
      </h3>
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">{product.unit || "Unit"}</span>
        <motion.span className="text-sm font-medium text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:text-green-600">
          View Details →
        </motion.span>
      </div>
    </div>
  </motion.div>
)

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedFavorites = localStorage.getItem("productFavorites")
    if (savedFavorites) {
      try {
        const favoriteArray = JSON.parse(savedFavorites)
        setFavorites(new Set(favoriteArray))
      } catch (error) {
        console.error("Error loading favorites:", error)
      }
    }
  }, [])

  // ✅ Fetch products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error("Failed to fetch products")
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // ✅ Unique categories
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category || "Uncategorized")))],
    [products],
  )

  // ✅ Filtered Products with indices
  const filteredProductsWithIndex = useMemo(() => {
    return products
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
      })
  }, [products, searchTerm, selectedCategory])

  const toggleFavorite = (index: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(index)) {
        newFavorites.delete(index)
      } else {
        newFavorites.add(index)
      }
      localStorage.setItem("productFavorites", JSON.stringify(Array.from(newFavorites)))
      return newFavorites
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="mb-4"
          >
            <Sparkles className="h-12 w-12 text-green-500 mx-auto" />
          </motion.div>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">Loading products...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* 🌿 Hero Section */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-700 text-white py-20 text-center relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8" />
            <h1 className="text-5xl font-extrabold tracking-tight">Discover Our Fresh Products</h1>
            <Sparkles className="h-8 w-8" />
          </div>
          <p className="mt-3 text-lg opacity-90 max-w-2xl mx-auto">
            Hand-picked produce from trusted farms across the globe. Find your favorites and add them to your wishlist!
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <motion.div
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
              whileHover={{ scale: 1.05 }}
            >
              ❤️ {favorites.size} Favorites
            </motion.div>
            <motion.div
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
              whileHover={{ scale: 1.05 }}
            >
              📦 {filteredProductsWithIndex.length} Products
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 🔍 Search Bar */}
      <motion.div
        className="mt-10 mb-8 flex flex-col md:flex-row gap-4 items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative flex-grow w-full md:w-1/2">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <motion.input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            whileFocus={{ scale: 1.02 }}
          />
        </div>
      </motion.div>

      {/* 🏷️ Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-10 px-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2 w-full justify-center">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter by category:</span>
        </div>
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full border text-sm font-medium relative overflow-hidden transition-all duration-300 ${
              selectedCategory === category
                ? "bg-green-500 text-white border-green-500 shadow-lg"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700"
            }`}
            whileHover={{
              scale: 1.1,
              boxShadow: selectedCategory === category ? "0 0 15px rgba(34,197,94,0.7)" : "0 0 8px rgba(34,197,94,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* 🛒 Product Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 pb-20"
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
          {filteredProductsWithIndex.length > 0 ? (
            filteredProductsWithIndex.map(({ product, index }) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard
                  product={product}
                  productIndex={index}
                  onClick={() => {
                    setSelectedProduct(product)
                    setSelectedProductIndex(index)
                  }}
                  isFavorite={favorites.has(index)}
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
              <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg">No products found matching your search.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 🪟 Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && selectedProductIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
          >
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => {
                setSelectedProduct(null)
                setSelectedProductIndex(null)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductsPage
