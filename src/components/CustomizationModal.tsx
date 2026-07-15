import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Coffee, Star, ShoppingBag } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  onAddToCart: (cartItem: CartItem) => void;
}

export default function CustomizationModal({
  isOpen,
  onClose,
  menuItem,
  onAddToCart,
}: CustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [temp, setTemp] = useState<'Panas' | 'Dingin'>('Dingin');
  const [sugar, setSugar] = useState<'No Sugar' | 'Less Sugar' | 'Normal' | 'Extra Sugar'>('Normal');
  const [size, setSize] = useState<'Regular' | 'Large'>('Regular');
  const [notes, setNotes] = useState('');

  // Reset states when item changes
  useEffect(() => {
    if (menuItem) {
      setQuantity(1);
      if (menuItem.options?.temperatures?.length) {
        setTemp(menuItem.options.temperatures[0]);
      }
      if (menuItem.options?.sugarLevels?.length) {
        setSugar('Normal');
      }
      if (menuItem.options?.sizes?.length) {
        setSize('Regular');
      }
      setNotes('');
    }
  }, [menuItem]);

  if (!menuItem) return null;

  // Calculate dynamic price based on options
  const getSingleItemPrice = () => {
    let base = menuItem.price;
    if (size === 'Large') {
      base += 5000; // Extra charge for large size
    }
    return base;
  };

  const totalPrice = getSingleItemPrice() * quantity;

  const handleAdd = () => {
    // Generate a unique ID for this specific combination of options
    const optionKey = `${menuItem.id}-${temp}-${sugar}-${size}-${notes.trim()}`;
    
    const cartItem: CartItem = {
      id: optionKey,
      menuItem,
      quantity,
      selectedTemperature: menuItem.options?.temperatures?.length ? temp : undefined,
      selectedSugarLevel: menuItem.options?.sugarLevels?.length ? sugar : undefined,
      selectedSize: menuItem.options?.sizes?.length ? size : undefined,
      notes: notes.trim() || undefined,
    };

    onAddToCart(cartItem);
    onClose();
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            id="customization-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header Drag Bar */}
            <div className="w-full flex justify-center py-3 bg-[#F8F9FA] border-b border-[#EDF2F7]">
              <div className="w-12 h-1.5 bg-[#EDF2F7] rounded-full" />
            </div>

            <div className="overflow-y-auto flex-1 p-6 pb-24">
              {/* Top Details */}
              <div className="flex gap-4 mb-6">
                <img
                  src={menuItem.image}
                  alt={menuItem.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 object-cover rounded-2xl shadow-sm"
                />
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#8D6E63]/10 text-[#8D6E63] px-2.5 py-1 rounded-full mb-2">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {menuItem.rating}
                  </span>
                  <h3 className="text-lg font-bold text-[#2D3436] leading-tight">
                    {menuItem.name}
                  </h3>
                  <p className="text-xs text-[#636E72] mt-1 line-clamp-2">
                    {menuItem.description}
                  </p>
                  <div className="text-base font-bold text-[#8D6E63] mt-2 font-mono">
                    {formatPrice(menuItem.price)}
                  </div>
                </div>
                <button
                  id="close-drawer-button"
                  onClick={onClose}
                  className="p-1.5 hover:bg-slate-100 rounded-full h-fit self-start transition-colors"
                >
                  <X className="w-5 h-5 text-[#636E72]" />
                </button>
              </div>

              {/* TEMPERATURE SECTION */}
              {menuItem.options?.temperatures && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-[#2D3436] mb-2.5 flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-[#8D6E63]" /> Suhu Minuman
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {menuItem.options.temperatures.map((t) => (
                      <button
                        key={t}
                        id={`temp-option-${t}`}
                        onClick={() => setTemp(t)}
                        className={`py-3 px-4 rounded-2xl border text-center font-medium text-sm transition-all duration-200 ${
                          temp === t
                            ? 'border-[#8D6E63] bg-[#8D6E63]/5 text-[#2D3436] shadow-sm ring-1 ring-[#8D6E63]'
                            : 'border-[#EDF2F7] text-[#636E72] hover:border-[#636E72]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SIZE SECTION */}
              {menuItem.options?.sizes && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-[#2D3436] mb-2.5">Ukuran Gelas</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {menuItem.options.sizes.map((s) => (
                      <button
                        key={s}
                        id={`size-option-${s}`}
                        onClick={() => setSize(s)}
                        className={`py-3 px-4 rounded-2xl border flex flex-col items-center justify-center transition-all duration-200 ${
                          size === s
                            ? 'border-[#8D6E63] bg-[#8D6E63]/5 text-[#2D3436] shadow-sm ring-1 ring-[#8D6E63]'
                            : 'border-[#EDF2F7] text-[#636E72] hover:border-[#636E72]'
                        }`}
                      >
                        <span className="font-semibold text-sm">{s}</span>
                        <span className="text-[10px] text-[#636E72] font-mono mt-0.5">
                          {s === 'Large' ? '+Rp 5.000' : 'Harga Standar'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SUGAR LEVEL SECTION */}
              {menuItem.options?.sugarLevels && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-[#2D3436] mb-2.5">Tingkat Kemanisan</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {menuItem.options.sugarLevels.map((s) => (
                      <button
                        key={s}
                        id={`sugar-option-${s.replace(' ', '-')}`}
                        onClick={() => setSugar(s)}
                        className={`py-2.5 px-3 rounded-xl border text-center font-medium text-xs transition-all duration-200 ${
                          sugar === s
                            ? 'border-[#8D6E63] bg-[#8D6E63]/5 text-[#2D3436] shadow-sm ring-1 ring-[#8D6E63]'
                            : 'border-[#EDF2F7] text-[#636E72] hover:border-[#636E72]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SPECIAL NOTES */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#2D3436] mb-2.5">Catatan Khusus (Opsional)</h4>
                <textarea
                  id="special-notes-textarea"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Kurangi es, tanpa sedotan, atau request susu ganti oatmilk (+Rp 5.000, bayar di kasir)..."
                  className="w-full text-xs text-[#2D3436] border border-[#EDF2F7] rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#8D6E63] focus:border-[#8D6E63] bg-[#F1F3F5] transition-all placeholder:text-[#636E72]/60"
                />
              </div>

              {/* QUANTITY ROW */}
              <div className="flex items-center justify-between py-4 border-t border-[#EDF2F7]">
                <span className="text-sm font-semibold text-[#2D3436]">Jumlah Pesanan</span>
                <div className="flex items-center bg-[#F1F3F5] px-3 py-1.5 rounded-full border border-[#EDF2F7] shadow-inner">
                  <button
                    id="decrease-modal-qty"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1 rounded-full text-[#636E72] hover:bg-slate-200 transition-colors disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm text-[#2D3436] w-8 text-center font-mono select-none">
                    {quantity}
                  </span>
                  <button
                    id="increase-modal-qty"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 rounded-full text-[#636E72] hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Add Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#EDF2F7] p-4 px-6 flex items-center justify-between gap-4 shadow-lg">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#636E72] font-semibold">Total Harga</span>
                <span className="text-lg font-bold text-[#2D3436] font-mono">{formatPrice(totalPrice)}</span>
              </div>
              <button
                id="add-to-cart-button"
                onClick={handleAdd}
                className="flex-1 bg-[#2D3436] hover:bg-black text-white font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Masukkan Keranjang</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
