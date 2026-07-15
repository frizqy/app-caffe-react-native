import { useState } from 'react';
import { Search, Sparkles, Plus, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Category, MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menuData';

interface MenuTabProps {
  onSelectItem: (item: MenuItem) => void;
}

export default function MenuTab({ onSelectItem }: MenuTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Category[] = ['Semua', 'Kopi', 'Non-Kopi', 'Makanan', 'Cemilan'];

  // Filter items
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA]">
      {/* Top Welcome Card */}
      <div className="p-6 pb-4 bg-white border-b border-[#EDF2F7] sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-extrabold text-[#2D3436] tracking-tight flex items-center gap-1.5">
              <span>☕ Kalea Café</span>
            </h1>
            <p className="text-xs text-[#636E72] mt-0.5 font-medium">Mau ngopi apa hari ini? Yuk, pesan!</p>
          </div>
          <span className="bg-[#8D6E63]/10 text-[#8D6E63] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#8D6E63] animate-pulse" />
            Promo Aktif
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#636E72] w-4.5 h-4.5" />
          <input
            id="menu-search-input"
            type="text"
            placeholder="Cari kopi, pastry, pasta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F1F3F5] text-[#2D3436] text-sm pl-11 pr-4 py-3 rounded-2xl border-none focus:outline-none focus:ring-1.5 focus:ring-[#8D6E63] focus:bg-white transition-all placeholder:text-[#636E72]/60 font-medium"
          />
        </div>
      </div>

      {/* Horizontal Category Pill Selector */}
      <div className="px-6 py-4 overflow-x-auto flex gap-2 scrollbar-none whitespace-nowrap bg-[#F8F9FA]">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`category-pill-${cat.replace(' ', '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 select-none ${
              selectedCategory === cat
                ? 'bg-[#2D3436] text-white shadow-lg'
                : 'bg-white text-[#636E72] hover:text-[#2D3436] border border-[#EDF2F7] hover:bg-[#F1F3F5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Catalog Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {filteredItems.length > 0 ? (
          <motion.div
            id="menu-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                id={`menu-item-card-${item.id}`}
                variants={itemVariants}
                onClick={() => onSelectItem(item)}
                className="bg-white rounded-[24px] border border-[#F1F3F5] p-3.5 flex gap-4 hover:border-[#8D6E63]/40 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 group active:scale-[0.99]"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#F8F9FA] shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.popular && (
                    <span className="absolute top-1.5 left-1.5 bg-[#8D6E63] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 uppercase tracking-wide">
                      POPULER
                    </span>
                  )}
                </div>

                {/* Info Text */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h3 className="text-sm font-bold text-[#2D3436] group-hover:text-[#8D6E63] transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span className="text-[11px] font-bold text-[#636E72]">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#636E72] mt-0.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-bold text-[#8D6E63] font-mono">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      id={`fast-add-${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className="w-8 h-8 rounded-full bg-[#2D3436] text-white flex items-center justify-center hover:bg-[#8D6E63] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-[#636E72]" />
            </div>
            <p className="text-sm font-semibold text-[#2D3436]">Menu tidak ditemukan</p>
            <p className="text-xs text-[#636E72] mt-1">Coba gunakan kata kunci pencarian yang berbeda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
