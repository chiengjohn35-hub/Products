import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { cartApi } from '../services/api';

const API_BASE_URL = 'http://localhost:8000';

const CartDrawer = ({ isOpen, onClose, cart = [], onUpdate }) => {
  const safeCart = Array.isArray(cart) ? cart : [];

  const updateQty = async (productId, delta) => {
    try {
      await cartApi.add({ product_id: productId, quantity: delta });
      onUpdate();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const remove = async (productId) => {
    try {
      await cartApi.delete(productId);
      onUpdate();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const total = safeCart.reduce((s, i) => s + (i.product.price * i.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} 
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50" 
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[60] p-8 flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Your Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {safeCart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                  <div className="bg-neutral-50 p-6 rounded-3xl mb-4">
                    <ShoppingCart size={48} strokeWidth={1.5} />
                  </div>
                  <p className="text-lg font-medium">Your cart is empty</p>
                </div>
              ) : (
                safeCart.map((item) => (
                  <div 
                    key={item.product_id} 
                    className="flex gap-4 p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm hover:border-neutral-200 transition-all"
                  >
                    {/* Square Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-50 flex-shrink-0">
                      <img 
                        src={`${API_BASE_URL}${item.product.image_url}`} 
                        alt={item.product.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-neutral-900 truncate">{item.product.name}</h4>
                        <button 
                          onClick={() => remove(item.product_id)} 
                          className="text-neutral-300 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-bold text-neutral-900">${item.product.price}</p>
                        
                        {/* Modern Quantity Selector */}
                        <div className="flex items-center bg-neutral-100 rounded-lg p-1">
                          <button 
                            onClick={() => updateQty(item.product_id, -1)}
                            className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-neutral-600"
                          >
                            <Minus size={12}/>
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQty(item.product_id, 1)}
                            className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-neutral-600"
                          >
                            <Plus size={12}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {safeCart.length > 0 && (
              <div className="pt-6 border-t border-neutral-100 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <span className="text-neutral-400 text-sm font-medium">Total Amount</span>
                    <span className="text-3xl font-bold text-neutral-900">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold text-lg hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-lg shadow-neutral-200">
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
