import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { ShoppingBag } from "lucide-react";

const ProductGrid = ({ products = [], viewMode = "grid" }) => {
  if (!products.length) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-gray-300 w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 max-w-xs mx-auto text-sm">
          We couldn't find any products matching your current criteria. Try adjusting your filters!
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            index={index}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(ProductGrid);
