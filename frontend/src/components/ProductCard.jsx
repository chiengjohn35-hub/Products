import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

// Centralize your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductCard = ({ product, onAdd, isAdded }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddClick = async () => {
    setIsLoading(true);
    try {
      await onAdd(product);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-neutral-100">
        <img 
          // Prepend base URL to the database path
          src={`${API_BASE_URL}${product.image_url}`} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          // Fallback with fixed URL or standard placeholder
          onError={(e) => {
          if (!e.target.dataset.fallback) {
            e.target.dataset.fallback = "true";
            e.target.src = "https://placehold.co/600x400";
          }
        }}
        />
      </div>
      <div className="px-2">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
          ID: {product.id}
        </p>
        <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-xl font-medium mb-4">${product.price}</p>
        
        <button 
          onClick={handleAddClick}
          disabled={isLoading || isAdded}
          className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold transition-all active:scale-95 ${
            isAdded 
              ? 'bg-green-50 text-green-600 border border-green-100' 
              : 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-400'
          }`}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isAdded ? (
            <>
              <CheckCircle2 size={18} />
              <span>Added</span>
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </motion.div>
  );
};


export default ProductCard;
