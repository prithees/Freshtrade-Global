"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Heart, Search, Sparkles, Filter, ShoppingCart, X, Plus, Minus, Trash2, AlertCircle, CheckCircle, Clock, Zap, TrendingUp } from 'lucide-react'
import { AnimatePresence, motion } from "framer-motion"
import Lottie from "lottie-react"
import emptyBox from "./assets/empty1.json"
import type { Product } from "../types"

const API_URL = "http://localhost:4000/api/products"
const ORDERS_API = "http://localhost:4000/api/orders"

type CartItem = {
  product: Product
  quantity: number
  addedAt: number
  isEditingQty?: boolean
  cartItemId: string // Added unique identifier for each cart item to prevent merging
}

// Toast Notification Component
const Toast: React.FC<{
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
}> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-blue-500"

  const Icon = type === "success" ? CheckCircle : type === "error" ? AlertCircle : Clock

  return (
    <motion.div
      initial={{ y: -100, opacity: 0, x: 20 }}
      animate={{ y: 0, opacity: 1, x: 0 }}
      exit={{ y: -100, opacity: 0 }}
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-xl shadow-2xl z-40 flex items-center gap-3 backdrop-blur-sm border border-white/20`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="font-medium">{message}</span>
    </motion.div>
  )
}

// ✅ Product Card Component with Stock Status
const ProductCard: React.FC<{
  product: Product
  productIndex: number
  onClick: () => void
  isFavorite: boolean
  toggleFavorite: (index: number) => void
  addToCart: (product: Product) => void
}> = ({
  product,
  productIndex,
  onClick,
  isFavorite,
  toggleFavorite,
  addToCart,
}) => {
  const isOutOfStock = product.stockStatus === "Out of Stock"
  const isLowStock = product.stockStatus === "Low Stock"

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group relative border border-gray-200 transition-all hover:shadow-2xl ${isOutOfStock ? "opacity-60" : ""}`}
      onClick={onClick}
      whileHover={!isOutOfStock ? { scale: 1.02, y: -4 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      {/* Favorite Button */}
      {/* <motion.button
        onClick={(e) => {
          e.stopPropagation()
          toggleFavorite(productIndex)
        }}
        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-red-50 transition-all z-10"
        whileHover={{ scale: 1.15, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart
          className={`h-5 w-5 transition-all ${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </motion.button> */}

      {/* Stock Status Badge */}
      {isLowStock && (
        <motion.div
          className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <TrendingUp className="h-3 w-3" /> Low Stock
        </motion.div>
      )}

      {isOutOfStock && (
        <motion.div
          className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          Out of Stock
        </motion.div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-52">
        <motion.img
          className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          src={product.imageUrl}
          alt={product.productName}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      </div>

      <div className="p-4">
        <span className="text-xs text-green-600 font-bold uppercase tracking-widest">
          {product.category || "Uncategorized"}
        </span>
        <h3 className="text-lg font-bold mt-1 mb-2 text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.productName}
        </h3>

        {/* Price and Unit */}
        <div className="flex items-baseline gap-2 mb-3">
          <motion.span 
            className="text-2xl font-bold text-green-600"
            whileHover={{ scale: 1.1 }}
          >
            ₹{product.pricePerUnit}
          </motion.span>
          <span className="text-sm text-gray-500">/{product.unit || "Unit"}</span>
        </div>

        {/* Min Order Qty Info */}
        {/* {product.minOrderQty > 1 && (
          <p className="text-xs text-gray-500 mb-3 bg-gray-100 px-2 py-1 rounded-md w-fit">
            Min: {product.minOrderQty}
          </p>
        )} */}

        <div className="flex justify-between items-center gap-2">
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              if (!isOutOfStock) {
                addToCart(product)
              }
            }}
            whileTap={{ scale: 0.92 }}
            whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
            disabled={isOutOfStock}
            className={`flex-1 px-3 py-2 rounded-lg text-white text-sm font-bold shadow transition-all flex items-center justify-center gap-2 ${
              isOutOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 active:bg-green-700"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? "Out of Stock" : "Add"}
          </motion.button>

          <motion.span className="text-sm font-bold text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View →
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}

/* Product Detail Modal */
const ProductDetailModal: React.FC<{
  product: Product
  onClose: () => void
  addToCart: (product: Product) => void
}> = ({ product, onClose, addToCart }) => {
  const isOutOfStock = product.stockStatus === "Out of Stock"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-start justify-between p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">
            {product.productName}
          </h3>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.productName}
            className="w-full h-96 object-cover rounded-xl shadow-lg"
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-3">
                <motion.span 
                  className="text-4xl font-bold text-green-600"
                  whileHover={{ scale: 1.05 }}
                >
                  ₹{product.pricePerUnit}
                </motion.span>
                <span className="text-gray-500">
                  per {product.unit || "Unit"}
                </span>
              </div>

              {/* Stock Status */}
              <motion.div 
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    product.stockStatus === "In Stock"
                      ? "bg-green-100 text-green-800"
                      : product.stockStatus === "Low Stock"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stockStatus}
                </span>
              </motion.div>

              {product.minOrderQty > 1 && (
                <p className="text-sm text-gray-600 mb-3 bg-blue-50 px-3 py-2 rounded-lg">
                  📦 Minimum order: {product.minOrderQty} units
                </p>
              )}
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed text-base">
              {product.description || "No description available."}
            </p>

            {product.tags && product.tags.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 mb-3">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            <motion.button
              onClick={() => {
                addToCart(product)
                onClose()
              }}
              whileTap={{ scale: 0.95 }}
              whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
              disabled={isOutOfStock}
              className={`w-full px-6 py-4 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-lg ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:scale-95"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

/* Cart Sidebar */
const CartSidebar: React.FC<{
  open: boolean
  onClose: () => void
  cart: CartItem[]
  updateQuantity: (cartItemId: string, qty: number) => void
  removeItem: (cartItemId: string) => void
  clearCart: () => void
  onCheckoutClick: () => void
}> = ({
  open,
  onClose,
  cart,
  updateQuantity,
  removeItem,
  clearCart,
  onCheckoutClick,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQtyValue, setEditQtyValue] = useState<string>("")

  const subtotal = cart.reduce(
    (s, it) => s + Number(it.product.pricePerUnit || 0) * it.quantity,
    0
  )
  const totalItems = cart.reduce((s, it) => s + it.quantity, 0)

  const handleQtyInputChange = (id: string, currentQty: number) => {
    setEditingId(id)
    setEditQtyValue(currentQty.toString())
  }

  const handleQtySave = (id: string, product: Product) => {
    const newQty = parseInt(editQtyValue, 10)
    const minQty = product.minOrderQty || 1

    if (isNaN(newQty) || newQty < minQty) {
      setEditingId(null)
      return
    }

    updateQuantity(id, newQty)
    setEditingId(null)
    setEditQtyValue("")
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-gradient-to-br from-white to-gray-50 shadow-2xl z-50 overflow-auto"
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 20 }}
                transition={{ duration: 0.5 }}
              >
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </motion.div>
              <div>
                <h4 className="text-lg font-bold">Your Cart</h4>
                <span className="text-sm text-gray-500">
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <motion.button
                  onClick={clearCart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm px-3 py-2 rounded-lg hover:bg-red-100 text-red-600 font-bold transition-colors"
                >
                  Clear
                </motion.button>
              )}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          <div className="p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <Lottie animationData={emptyBox} loop className="w-48 h-48 mx-auto" />
                <p className="text-gray-600 mt-4 font-medium">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map((it) => (
                    <motion.div
                      key={it.cartItemId}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="flex items-center gap-3 border border-green-200 rounded-xl p-3 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all hover:shadow-md"
                    >
                      <motion.img
                        src={it.product.imageUrl || "/placeholder.svg"}
                        alt={it.product.productName}
                        className="w-16 h-16 object-cover rounded-lg shadow"
                        whileHover={{ scale: 1.05 }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-900 text-sm line-clamp-2">
                              {it.product.productName}
                            </div>
                            <div className="text-xs text-gray-600 mt-1 font-medium">
                              ₹{it.product.pricePerUnit}/{it.product.unit}
                            </div>
                          </div>
                          <div className="text-sm font-bold text-green-600 text-right">
                            ₹
                            {(
                              Number(it.product.pricePerUnit || 0) * it.quantity
                            ).toFixed(2)}
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          {editingId === it.cartItemId ? (
                            <div className="flex items-center gap-2 bg-white rounded-lg border border-green-300 flex-1">
                              <input
                                type="number"
                                value={editQtyValue}
                                onChange={(e) => setEditQtyValue(e.target.value)}
                                onBlur={() =>
                                  handleQtySave(it.cartItemId, it.product)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleQtySave(it.cartItemId, it.product)
                                  } else if (e.key === "Escape") {
                                    setEditingId(null)
                                  }
                                }}
                                autoFocus
                                min={it.product.minOrderQty || 1}
                                className="w-full px-2 py-1 text-center text-sm font-bold border-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-300">
                              <motion.button
                                onClick={() =>
                                  updateQuantity(
                                    it.cartItemId,
                                    Math.max(
                                      it.product.minOrderQty || 1,
                                      it.quantity - 1
                                    )
                                  )
                                }
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 hover:bg-red-100 transition-colors rounded"
                              >
                                <Minus className="h-3 w-3 text-red-500" />
                              </motion.button>
                              <motion.button
                                onClick={() =>
                                  handleQtyInputChange(it.cartItemId, it.quantity)
                                }
                                className="px-2 text-sm font-bold hover:bg-green-50 transition-colors flex-1 min-w-12"
                              >
                                {it.quantity}
                              </motion.button>
                              <motion.button
                                onClick={() =>
                                  updateQuantity(it.cartItemId, it.quantity + 1)
                                }
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 hover:bg-green-100 transition-colors rounded"
                              >
                                <Plus className="h-3 w-3 text-green-500" />
                              </motion.button>
                            </div>
                          )}

                          <motion.button
                            onClick={() => removeItem(it.cartItemId)}
                            whileHover={{ scale: 1.15, rotate: 10 }}
                            whileTap={{ scale: 0.85 }}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t border-gray-300 pt-4 space-y-3 sticky bottom-0 bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 -m-4 mt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <motion.span 
                        className="font-bold text-lg text-green-600"
                        whileHover={{ scale: 1.1 }}
                      >
                        ₹{subtotal.toFixed(2)}
                      </motion.span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Items ({totalItems})</span>
                      <span>{totalItems} unit{totalItems !== 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={onCheckoutClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Zap className="h-4 w-4" /> Checkout
                    </motion.button>
                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-3 rounded-xl border-2 border-green-300 text-green-700 font-bold hover:bg-green-50 transition-colors"
                    >
                      Shop
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

/* Main Products Page */
const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(
    null
  )
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)

  // Toast notifications
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)

  // Checkout form fields
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [submittingOrder, setSubmittingOrder] = useState(false)

  // Load favorites + cart from localStorage
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

    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error("Failed to fetch products")
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        setToast({
          message: "Failed to load products",
          type: "error",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Persist favorites
  useEffect(() => {
    localStorage.setItem("productFavorites", JSON.stringify(Array.from(favorites)))
  }, [favorites])

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Get unique categories
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(products.map((p) => p.category || "Uncategorized"))),
    ],
    [products]
  )

  // Filter products
  const filteredProductsWithIndex = useMemo(() => {
    return products
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => {
        const matchesCategory =
          selectedCategory === "All" || product.category === selectedCategory
        const matchesSearch = product.productName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
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
      return newFavorites
    })
  }

  const addToCart = (product: Product) => {
    if (product.stockStatus === "Out of Stock") {
      setToast({
        message: `${product.productName} is out of stock`,
        type: "error",
      })
      return
    }

    const productId = product.productId || product.productName
    const cartItemId = `${productId}-${Date.now()}-${Math.random()}`

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.product.productId === product.productId && cartItem.product.productName === product.productName
      )

      let updatedCart: CartItem[]

      if (existingItemIndex >= 0) {
        // Product already exists - increment quantity by 1
        updatedCart = prevCart.map((cartItem, idx) =>
          idx === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
        setToast({
          message: `Added 1 more ${product.productName}`,
          type: "info",
        })
      } else {
        // Brand new product - add with min quantity
        updatedCart = [
          ...prevCart,
          {
            product,
            quantity: product.minOrderQty || 1,
            addedAt: Date.now(),
            isEditingQty: false,
            cartItemId, // Added unique cart item ID
          },
        ]
        setToast({
          message: `${product.productName} added to cart`,
          type: "success",
        })
      }

      return updatedCart
    })

    setCartOpen(true)
  }

  const updateQuantity = (cartItemId: string, qty: number) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const minQty = item.product.minOrderQty || 1
          return { ...item, quantity: Math.max(minQty, qty) }
        }
        return item
      })
      return updatedCart
    })
  }

  const removeItem = (cartItemId: string) => {
    const removedItem = cart.find(item => item.cartItemId === cartItemId)?.product.productName
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId))
    setToast({
      message: `${removedItem} removed from cart`,
      type: "info",
    })
  }

  const clearCart = () => {
    setCart([])
    setToast({
      message: "Cart cleared",
      type: "info",
    })
  }

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      setToast({
        message: "Your cart is empty",
        type: "error",
      })
      return
    }
    setShowCheckoutForm(true)
  }

  const handleSubmitOrder = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!customerName.trim()) {
      setToast({
        message: "Please enter your name",
        type: "error",
      })
      return
    }
    if (!customerPhone.trim()) {
      setToast({
        message: "Please enter your phone number",
        type: "error",
      })
      return
    }
    if (!customerAddress.trim()) {
      setToast({
        message: "Please enter your address",
        type: "error",
      })
      return
    }
    if (cart.length === 0) {
      setToast({
        message: "Your cart is empty",
        type: "error",
      })
      return
    }

    setSubmittingOrder(true)

    const orderPayload = {
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress,
        notes: deliveryNotes,
      },
      items: cart.map((it) => ({
        productId: it.product.productId || it.product,
        name: it.product.productName,
        price: Number(it.product.pricePerUnit || 0),
        quantity: it.quantity,
      })),
      total: cart.reduce(
        (s, it) => s + Number(it.product.pricePerUnit || 0) * it.quantity,
        0
      ),
      createdAt: new Date().toISOString(),
    }

    try {
      const res = await fetch(ORDERS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })

      if (!res.ok) {
        throw new Error("Failed to place order")
      }

      const respData = await res.json()
      setToast({
        message: `Order placed successfully! ID: ${respData.id ?? "N/A"}`,
        type: "success",
      })

      setSubmittingOrder(false)
      setCart([])
      setShowCheckoutForm(false)
      setCartOpen(false)
      setCustomerName("")
      setCustomerPhone("")
      setCustomerEmail("")
      setCustomerAddress("")
      setDeliveryNotes("")
    } catch (error) {
      console.error("Order submit error:", error)
      setToast({
        message: "Failed to place order. Please try again.",
        type: "error",
      })
      setSubmittingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="mb-4"
          >
            <Sparkles className="h-12 w-12 text-green-500 mx-auto" />
          </motion.div>
          <p className="mt-3 text-lg font-bold text-green-600">
            Loading products...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-700 text-white py-16 text-center relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="absolute top-10 left-20 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white rounded-full blur-3xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}>
              <Sparkles className="h-7 w-7" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Discover Our Fresh Products
            </h1>
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}>
              <Sparkles className="h-7 w-7" />
            </motion.div>
          </div>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-green-50">
            Hand-picked produce from trusted farms. Find your favorites and
            order now!
          </p>

          <div className="absolute right-6 top-6 flex items-center gap-3">
            <div className="relative">
              <motion.button
                onClick={() => setCartOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white text-green-600 p-3 rounded-full shadow-lg hover:shadow-2xl transition-all font-bold"
              >
                <ShoppingCart className="h-6 w-6" />
              </motion.button>
              {cart.length > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                >
                  {cart.reduce((s, it) => s + it.quantity, 0)}
                </motion.div>
              )}
            </div>

            {/* <motion.div 
              className="bg-white px-4 py-2 rounded-full shadow-md text-gray-800 font-bold"
              whileHover={{ scale: 1.05 }}
            >
              ❤️ {favorites.size} Favorites
            </motion.div> */}
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <motion.div
        className="mt-8 mb-8 flex flex-col md:flex-row gap-4 items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative flex-grow w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <motion.input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-500 shadow-sm"
            whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)" }}
          />
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="mb-10 px-4">
        <div className="flex items-center gap-2 text-gray-600 mb-4 justify-center md:justify-start">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-bold">Filter by category:</span>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-lg"
                  : "border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-400"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-6 pb-20"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.04 },
          },
        }}
      >
        <AnimatePresence>
          {filteredProductsWithIndex.length > 0 ? (
            filteredProductsWithIndex.map(({ product, index }) => (
              <motion.div
                key={product.productId ?? index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.35 }}
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
                  addToCart={(p) => addToCart(p)}
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
              <p className="text-gray-600 mt-6 text-lg font-medium">
                No products found matching your search.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && selectedProductIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
          >
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => {
                setSelectedProduct(null)
                setSelectedProductIndex(null)
              }}
              addToCart={(p) => addToCart(p)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
        onCheckoutClick={handleCheckoutClick}
      />

      {/* Checkout Form Modal */}
      <AnimatePresence>
        {showCheckoutForm && (
          <motion.div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-4">
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutForm(false)}
            />
            <motion.form
              onSubmit={handleSubmitOrder}
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 130, damping: 12 }}
              className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8 z-[71] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 pb-4">
                <h3 className="text-2xl font-bold text-gray-900">Checkout</h3>
                <motion.button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    placeholder="123 Main Street, City, State 12345"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Special instructions for delivery..."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-700 font-bold">Order Total:</span>
                    <motion.span 
                      className="text-3xl font-bold text-green-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      ₹
                      {cart
                        .reduce(
                          (s, it) =>
                            s + Number(it.product.pricePerUnit || 0) * it.quantity,
                          0
                        )
                        .toFixed(2)}
                    </motion.span>
                  </div>

                  <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-white pt-4">
                    <motion.button
                      type="button"
                      className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                      onClick={() => setShowCheckoutForm(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={submittingOrder}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {submittingOrder ? "Placing Order..." : "Place Order"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductsPage
