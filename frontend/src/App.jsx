import React, { useState } from 'react';
import { Package, ShoppingCart, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from './hooks/useStore';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';

const App = () => {
  const { products, totalCount, cart, search, setSearch, currentPage, setCurrentPage, handleAddToCart, refreshCart, addedItems } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalPages = Math.ceil(totalCount / 8);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 h-20 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 p-2 rounded-xl"><Package className="text-white" /></div>
          <span className="text-xl font-bold">Store</span>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-white border rounded-2xl">
          <ShoppingCart size={22} />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded-full ring-2 ring-white">{cart.length}</span>}
        </button>
      </nav>

      <header className="py-16 text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Discover Products</h1>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl shadow-sm outline-none" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(p => <ProductCard key={p.id} product={p} onAdd={handleAddToCart} isAdded={addedItems[p.id]} />)}
        </div>
        
        <div className="mt-12 flex justify-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border rounded-xl disabled:opacity-30"><ChevronLeft/></button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl ${currentPage === i + 1 ? 'bg-neutral-900 text-white' : 'bg-white border'}`}>{i + 1}</button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border rounded-xl disabled:opacity-30"><ChevronRight/></button>
        </div>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdate={refreshCart} />
    </div>
  );
};

export default App;
