import { useState, useEffect, useMemo } from 'react';
import { productApi, cartApi } from '../services/api';

export const useStore = (itemsPerPage = 8) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]); // Renamed for clarity
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addedItems, setAddedItems] = useState({});

  // 1. Refreshes the cart and handles the Cart Object -> Items Array transformation
  const refreshCart = async () => {
    try {
      const data = await cartApi.fetch();
      // If FastAPI returns { id: 1, items: [] }, we extract the items
      setCartItems(data.items || []); 
    } catch (err) {
      // If 404 (Cart not found), we just set items to empty instead of crashing
      setCartItems([]);
    }
  };

  useEffect(() => {
    productApi.list().then(setProducts).catch(console.error);
    refreshCart();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.id.toString().includes(search)
    );
  }, [products, search]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleAddToCart = async (product) => {
    try {
      await cartApi.add({
        product_id: product.id,
        // Ensure quantity is sent as requested by FastAPI
        quantity: 1 
      });
      
      setAddedItems(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => setAddedItems(prev => ({ ...prev, [product.id]: false })), 2000);
      
      // Refresh the cart so the drawer shows the new item immediately
      await refreshCart();
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  return {
    products: paginatedProducts,
    totalCount: filteredProducts.length,
    cart: cartItems, // This is now guaranteed to be an array
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    handleAddToCart,
    refreshCart,
    addedItems
  };
};
