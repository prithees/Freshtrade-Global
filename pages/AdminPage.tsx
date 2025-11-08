"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Edit2, Trash2, ChevronDown, Filter, DownloadCloud, CheckCircle } from "lucide-react"

interface Product {
  productId: string
  productName: string
  category: string
  pricePerUnit: number
  unit: string
  minOrderQty: number
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock"
  imageUrl?: string
  tags?: string[]
  description: string
  quantity?: number
}

const MOCK_PRODUCTS: Product[] = [
  {
    productId: "PROD001",
    productName: "Organic Tomatoes",
    category: "Vegetables",
    pricePerUnit: 45,
    unit: "kg",
    minOrderQty: 10,
    stockStatus: "In Stock",
    tags: ["organic", "fresh", "red"],
    description: "Fresh red tomatoes from local farms",
  },
  {
    productId: "PROD002",
    productName: "Basmati Rice",
    category: "Grains",
    pricePerUnit: 120,
    unit: "kg",
    minOrderQty: 25,
    stockStatus: "In Stock",
    tags: ["rice", "basmati", "premium"],
    description: "Premium quality basmati rice",
  },
  {
    productId: "PROD003",
    productName: "Spinach",
    category: "Vegetables",
    pricePerUnit: 35,
    unit: "kg",
    minOrderQty: 5,
    stockStatus: "Low Stock",
    tags: ["leafy", "green", "healthy"],
    description: "Fresh spinach leaves",
  },
  {
    productId: "PROD004",
    productName: "Mango",
    category: "Fruits",
    pricePerUnit: 60,
    unit: "dozen",
    minOrderQty: 5,
    stockStatus: "Out of Stock",
    tags: ["mango", "fruit", "seasonal"],
    description: "Premium mangoes in season",
  },
  {
    productId: "PROD005",
    productName: "Chicken Breast",
    category: "Meat",
    pricePerUnit: 280,
    unit: "kg",
    minOrderQty: 10,
    stockStatus: "In Stock",
    tags: ["chicken", "protein", "fresh"],
    description: "Fresh boneless chicken breast",
  },
]

const ProductFormModal: React.FC<{
  product: Partial<Product> | null
  onClose: () => void
  onSave: (product: Product) => void
}> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Product>>(product || {})
  const [saved, setSaved] = useState(false)

  React.useEffect(() => {
    setFormData(
      product || {
        productId: `PROD${Date.now()}`,
        tags: [],
        stockStatus: "In Stock",
      },
    )
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pricePerUnit" || name === "minOrderQty" ? Number.parseFloat(value) : value,
    }))
  }

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, tags: e.target.value.split(",").map((t) => t.trim()) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Product)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1200)
  }

  if (!product) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {product.productId ? "Edit Product" : "Add New Product"}
              </h2>
              <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 transition text-2xl">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <input
                name="productName"
                value={formData.productName || ""}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              <input
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                placeholder="Category"
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              <input
                name="pricePerUnit"
                value={formData.pricePerUnit || ""}
                onChange={handleChange}
                type="number"
                placeholder="Price Per Unit"
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              <input
                name="unit"
                value={formData.unit || ""}
                onChange={handleChange}
                placeholder="Unit (e.g., kg, dozen)"
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              <input
                name="minOrderQty"
                value={formData.minOrderQty || ""}
                onChange={handleChange}
                type="number"
                placeholder="Min Order Qty"
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              <select
                name="stockStatus"
                value={formData.stockStatus || "In Stock"}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              >
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
              <input
                name="imageUrl"
                value={formData.imageUrl || ""}
                onChange={handleChange}
                placeholder="Image URL"
                className="p-3 border border-gray-300 rounded-lg md:col-span-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              <input
                name="tags"
                value={formData.tags?.join(", ") || ""}
                onChange={handleTagChange}
                placeholder="Tags (comma-separated)"
                className="p-3 border border-gray-300 rounded-lg md:col-span-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Description"
                required
                className="p-3 border border-gray-300 rounded-lg md:col-span-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Save Product
              </motion.button>
            </div>
          </form>

          <AnimatePresence>
            {saved && (
              <motion.div
                className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 250 }}
                  className="text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-2" />
                  <p className="text-green-700 font-semibold text-lg">Product Saved!</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const StatsCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({
  label,
  value,
  icon,
  color,
}) => (
  <motion.div
    className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg`}
    whileHover={{ translateY: -4 }}
    transition={{ type: "spring", stiffness: 200 }}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm opacity-90 font-medium">{label}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="opacity-80">{icon}</div>
    </div>
  </motion.div>
)

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedStatus, setSelectedStatus] = useState<string>("All")
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name")

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      const matchesSearch =
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory
      const matchesStatus = selectedStatus === "All" || p.stockStatus === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })

    return filtered.sort((a, b) => {
      if (sortBy === "name") return a.productName.localeCompare(b.productName)
      if (sortBy === "price") return a.pricePerUnit - b.pricePerUnit
      if (sortBy === "stock") {
        const order = { "In Stock": 0, "Low Stock": 1, "Out of Stock": 2 }
        return order[a.stockStatus] - order[b.stockStatus]
      }
      return 0
    })
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy])

  const categories = ["All", ...new Set(products.map((p) => p.category))]
  const stockStatuses = ["All", "In Stock", "Low Stock", "Out of Stock"]

  const stats = {
    totalProducts: products.length,
    inStock: products.filter((p) => p.stockStatus === "In Stock").length,
    lowStock: products.filter((p) => p.stockStatus === "Low Stock").length,
    outOfStock: products.filter((p) => p.stockStatus === "Out of Stock").length,
  }

  const handleSaveProduct = (productToSave: Product) => {
    const exists = products.some((p) => p.productId === productToSave.productId)
    if (exists) {
      setProducts(products.map((p) => (p.productId === productToSave.productId ? productToSave : p)))
    } else {
      setProducts([...products, productToSave])
    }
    setEditingProduct(null)
  }

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.productId !== productId))
    }
  }

  const handleExport = () => {
    const csv = [
      ["Product Name", "Category", "Price", "Unit", "Min Order", "Stock Status"].join(","),
      ...filteredAndSortedProducts.map((p) =>
        [p.productName, p.category, p.pricePerUnit, p.unit, p.minOrderQty, p.stockStatus].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Management</h1>
          <p className="text-gray-600">Manage and organize your product inventory</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard
            label="Total Products"
            value={stats.totalProducts}
            icon={<Plus className="w-8 h-8" />}
            color="from-blue-500 to-blue-600"
          />
          <StatsCard
            label="In Stock"
            value={stats.inStock}
            icon={<CheckCircle className="w-8 h-8" />}
            color="from-green-500 to-green-600"
          />
          <StatsCard
            label="Low Stock"
            value={stats.lowStock}
            icon={<Filter className="w-8 h-8" />}
            color="from-yellow-500 to-yellow-600"
          />
          <StatsCard
            label="Out of Stock"
            value={stats.outOfStock}
            icon={<ChevronDown className="w-8 h-8" />}
            color="from-red-500 to-red-600"
          />
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            >
              {stockStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "price" | "stock")}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
            </select>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => setEditingProduct({})}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </motion.button>
            <motion.button
              onClick={handleExport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <DownloadCloud className="w-5 h-5" />
              Export CSV
            </motion.button>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Min Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Stock Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredAndSortedProducts.length > 0 ? (
                    filteredAndSortedProducts.map((product, index) => (
                      <motion.tr
                        key={product.productId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.productName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ₹{product.pricePerUnit.toFixed(2)} / {product.unit}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.minOrderQty} units</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              product.stockStatus === "In Stock"
                                ? "bg-green-100 text-green-700"
                                : product.stockStatus === "Low Stock"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.stockStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-center gap-2">
                            <motion.button
                              onClick={() => setEditingProduct(product)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Edit2 className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteProduct(product.productId)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or search term</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Results summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center text-sm text-gray-600"
        >
          Showing {filteredAndSortedProducts.length} of {products.length} products
        </motion.div>
      </div>

      {/* Form Modal */}
      <ProductFormModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleSaveProduct} />
    </div>
  )
}

export default AdminPage
