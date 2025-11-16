"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Package, User, Mail, Phone, MapPin, Trash2, ChevronDown, Search, Filter, MoreVertical, Copy, Share2, Eye, EyeOff } from 'lucide-react';

interface Order {
  _id: string;
  total: number;
  createdAt: string;
  isClosed: boolean;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: {
    name: string;
    price: number;
    quantity: number;
    productId: string;
  }[];
}

const API_URL = "http://localhost:4000/api/orders/unclosed";

// Skeleton Loader Component
function OrderSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-slate-200 p-5 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 overflow-hidden"
    >
      <div className="space-y-4">
        <div className="h-6 bg-slate-300 rounded-lg w-32 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-40 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

// Toast Notification Component
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-emerald-500" : "bg-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: -20 }}
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}
    >
      {type === "success" && <CheckCircle2 size={20} />}
      {message}
    </motion.div>
  );
}

// OrderCard component with expanded/collapsed state for more interactivity
function OrderCard({ order, index, onClose, closingOrder }: any) {
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyOrderId = () => {
    navigator.clipboard.writeText(order._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, rotateY: 90 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.8, rotateY: -90 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="border border-slate-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-300 transition-all bg-white overflow-hidden group"
      whileHover={{ y: -4 }}
    >
      {/* Order Header - Always Visible */}
      <div className="p-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <motion.div
              className="flex items-center gap-3 mb-2"
              whileHover={{ x: 5 }}
            >
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="text-blue-600" size={24} />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Order by {order.customer.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* <motion.button
              onClick={(e) => {
                e.stopPropagation();
                copyOrderId();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-all"
              title="Copy Order ID"
            >
              {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            </motion.button> */}

            {/* <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all"
            >
              <MoreVertical size={18} className="text-slate-600" />
            </motion.button> */}

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onClose(order._id);
              }}
              disabled={closingOrder === order._id}
              whileHover={{ scale: closingOrder === order._id ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                closingOrder === order._id
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg"
              }`}
            >
              {closingOrder === order._id ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <Loader2 size={16} />
                  </motion.div>
                  Closing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Close
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Quick Total Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-3 flex items-center gap-2"
        >
          <span className="text-sm text-slate-600">Total:</span>
          <motion.span
            className="text-lg font-bold text-emerald-600"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}
          >
            ₹{order.total}
          </motion.span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
            {order.items.length} items
          </span>
        </motion.div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-200 overflow-hidden"
          >
            <div className="p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
              {/* Customer Info */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-blue-50/50 p-4 rounded-lg space-y-3"
              >
                <h3 className="font-semibold text-slate-900 mb-3">Customer Details</h3>
                <motion.div
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100/50 transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <User size={18} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Name</p>
                    <p className="font-semibold text-slate-900">{order.customer.name}</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100/50 transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <Mail size={18} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-semibold text-slate-900">{order.customer.email}</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100/50 transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <Phone size={18} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-semibold text-slate-900">{order.customer.phone}</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-100/50 transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <MapPin size={18} className="text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500">Address</p>
                    <p className="font-semibold text-slate-900">{order.customer.address}</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Items with Interactive Hover */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Package size={18} className="text-emerald-600" />
                  Order Items
                </h3>
                <div className="space-y-2">
                  <AnimatePresence>
                    {order.items.map((item: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.08 }}
                        whileHover={{ x: 8, scale: 1.02 }}
                        className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex-1">
                          <motion.p
                            className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors"
                            whileHover={{ x: 4 }}
                          >
                            {item.name}
                          </motion.p>
                          <motion.p
                            className="text-sm text-slate-500"
                            whileHover={{ opacity: 0.8 }}
                          >
                            {item.quantity} × ₹{item.price}
                          </motion.p>
                        </div>
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.25 + idx * 0.08 }}
                          className="text-right"
                        >
                          <motion.p
                            className="font-bold text-emerald-600 text-lg"
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 0.3 }}
                          >
                            ₹{item.price * item.quantity}
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function UnclosedOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [closingOrder, setClosingOrder] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "highest" | "lowest">("latest");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchUnclosedOrders();
  }, []);

  const fetchUnclosedOrders = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch unclosed orders:", error);
      setToast({ message: "Failed to fetch orders", type: "error" });
    }
    setLoading(false);
  };

  const closeOrder = async (orderId: string) => {
    setClosingOrder(orderId);

    try {
      const res = await fetch(`http://localhost:4000/api/orders/close/${orderId}`, {
        method: "PUT",
      });

      if (!res.ok) {
        setToast({ message: "Failed to close the order", type: "error" });
        setClosingOrder(null);
        return;
      }

      setToast({ message: "Order closed successfully! ✨", type: "success" });
      
      setTimeout(() => {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        setClosingOrder(null);
      }, 300);
    } catch (error) {
      console.error("Error closing order:", error);
      setToast({ message: "Something went wrong", type: "error" });
      setClosingOrder(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      order.customer.name.toLowerCase().includes(searchLower) ||
      order.customer.email.toLowerCase().includes(searchLower) ||
      order.customer.phone.includes(searchTerm) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchLower))
    );
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "highest":
        return b.total - a.total;
      case "lowest":
        return a.total - b.total;
      case "latest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ rotate: 360, y: [0, -5, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
          >
            <Package className="text-blue-600" size={36} />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Unclosed Orders
            </h1>
            <p className="text-slate-600 text-sm">
              {sortedOrders.length > 0 ? `${sortedOrders.length} order${sortedOrders.length !== 1 ? "s" : ""} pending` : "All caught up!"}
            </p>
          </div>
        </div>
      </motion.div>

      {!loading && orders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-3"
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
          >
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by order ID, customer, email, or item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
            />
          </motion.div>

          <div className="flex gap-3">
            <motion.div
              className="relative flex-1 md:flex-none"
              whileHover={{ scale: 1.02 }}
            >
              <motion.button
                onClick={() => setFilterOpen(!filterOpen)}
                className="w-full md:w-auto flex items-center gap-2 px-4 py-3 bg-white border border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-slate-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter size={18} />
                Sort by: {sortBy}
                <motion.div
                  animate={{ rotate: filterOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 bg-white border border-slate-300 rounded-lg shadow-lg z-10 overflow-hidden w-full md:w-48"
                  >
                    {(["latest", "oldest", "highest", "lowest"] as const).map((option) => (
                      <motion.button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 transition-all ${
                          sortBy === option ? "bg-blue-100 text-blue-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                        }`}
                        whileHover={{ x: 5 }}
                      >
                        {option === "latest" && "Latest"}
                        {option === "oldest" && "Oldest"}
                        {option === "highest" && "Highest Total"}
                        {option === "lowest" && "Lowest Total"}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.button
              onClick={() => window.location.reload()}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Refresh
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      ) : sortedOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-20"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="mb-4"
          >
            <CheckCircle2 className="text-emerald-500 mx-auto" size={80} />
          </motion.div>
          <p className="text-2xl font-bold text-slate-700 mb-2">
            {searchTerm ? "No matching orders found" : "No pending orders"}
          </p>
          <p className="text-slate-500">
            {searchTerm ? "Try adjusting your search terms" : "Great job! All orders have been closed."}
          </p>
        </motion.div>
      ) : (
        <motion.div layout className="space-y-4">
          <AnimatePresence mode="popLayout">
            {sortedOrders.map((order, index) => (
              <OrderCard
                key={order._id}
                order={order}
                index={index}
                onClose={closeOrder}
                closingOrder={closingOrder}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
