import { useState } from 'react';
import { ShoppingBasket, Minus, Plus, Trash2, Ticket, ArrowRight, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartTabProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, amount: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (discountRate: number, promoCode: string) => void;
  onGoToMenu: () => void;
}

export default function CartTab({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onGoToMenu,
}: CartTabProps) {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [activePromoCode, setActivePromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate items cost
  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      let itemPrice = item.menuItem.price;
      if (item.selectedSize === 'Large') {
        itemPrice += 5000;
      }
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const subtotal = getSubtotal();
  const tax = Math.round(subtotal * 0.1); // 10% PPN
  const serviceCharge = subtotal > 0 ? 2000 : 0; // Flat Rp 2.000 service fee
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const grandTotal = subtotal + tax + serviceCharge - discountAmount;

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'KALEABARU') {
      setActivePromoCode(code);
      setDiscountPercent(10); // 10% off
      setPromoError('');
    } else if (code === '') {
      setPromoError('Masukkan kode promo terlebih dahulu.');
    } else {
      setPromoError('Kode promo tidak valid. Coba: KALEABARU');
    }
  };

  const handleRemovePromo = () => {
    setActivePromoCode('');
    setDiscountPercent(0);
    setPromoCodeInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA]">
      {/* Header */}
      <div className="p-6 bg-white border-b border-[#EDF2F7] sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#2D3436] tracking-tight">Daftar Pesanan</h1>
          <p className="text-xs text-[#636E72] mt-0.5 font-medium">
            {cart.length === 0 ? 'Keranjang Anda kosong' : `${cart.length} Jenis Menu Terpilih`}
          </p>
        </div>
        {cart.length > 0 && (
          <ShoppingBasket className="w-5 h-5 text-[#8D6E63]" />
        )}
      </div>

      {cart.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
          <div className="w-20 h-20 bg-[#8D6E63]/10 rounded-full flex items-center justify-center mb-4 border border-[#8D6E63]/20">
            <ShoppingBasket className="w-8 h-8 text-[#8D6E63] animate-bounce" />
          </div>
          <h2 className="text-base font-bold text-[#2D3436]">Belum Ada Pesanan</h2>
          <p className="text-xs text-[#636E72] mt-2 max-w-[240px] leading-relaxed mx-auto">
            Menu yang Anda pilih akan muncul di sini. Yuk jelajahi kopi & snack lezat kami!
          </p>
          <button
            id="empty-cart-go-to-menu"
            onClick={onGoToMenu}
            className="mt-6 bg-[#2D3436] hover:bg-[#8D6E63] text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        /* Cart List */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable list of items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {cart.map((item) => {
                const isLarge = item.selectedSize === 'Large';
                const itemPrice = item.menuItem.price + (isLarge ? 5000 : 0);
                const itemTotal = itemPrice * item.quantity;

                return (
                  <motion.div
                    key={item.id}
                    id={`cart-item-${item.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="bg-white rounded-[24px] border border-[#F1F3F5] p-3.5 flex gap-3 shadow-sm relative"
                  >
                    {/* Item image */}
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-xl shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="text-sm font-bold text-[#2D3436] line-clamp-1">
                            {item.menuItem.name}
                          </h3>
                          <button
                            id={`remove-cart-item-${item.id}`}
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Selected configurations */}
                        {(item.selectedTemperature || item.selectedSize || item.selectedSugarLevel) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedTemperature && (
                              <span className="text-[10px] font-semibold bg-[#8D6E63]/10 text-[#8D6E63] px-1.5 py-0.5 rounded-md">
                                {item.selectedTemperature}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded-md">
                                {item.selectedSize}
                              </span>
                            )}
                            {item.selectedSugarLevel && (
                              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-md">
                                {item.selectedSugarLevel}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Notes snippet */}
                        {item.notes && (
                          <div className="flex items-start gap-1 text-[10px] text-[#636E72] italic mt-1.5 font-medium bg-[#F8F9FA] p-1.5 rounded-lg border border-[#EDF2F7]">
                            <CornerDownRight className="w-3 h-3 text-[#636E72] shrink-0 mt-0.5" />
                            <span>"{item.notes}"</span>
                          </div>
                        )}
                      </div>

                      {/* Quantity & Item price */}
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs font-bold text-[#8D6E63] font-mono">
                          {formatPrice(itemTotal)}
                        </span>

                        <div className="flex items-center bg-[#F1F3F5] border border-[#EDF2F7] px-2 py-1 rounded-full shadow-inner scale-90">
                          <button
                            id={`decrease-cart-item-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-0.5 rounded-full text-[#636E72] hover:bg-slate-200 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-bold text-xs text-[#2D3436] w-6 text-center font-mono select-none">
                            {item.quantity}
                          </span>
                          <button
                            id={`increase-cart-item-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-0.5 rounded-full text-[#636E72] hover:bg-slate-200 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pricing Summary & Checkout Button (Sticky to bottom) */}
          <div className="bg-white border-t border-[#EDF2F7] p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
            {/* Promo Code Input Box */}
            <div className="bg-[#F8F9FA] border border-[#EDF2F7] rounded-2xl p-3 flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-[#636E72] w-4 h-4" />
                  <input
                    id="promo-code-input"
                    type="text"
                    placeholder="Masukkan kode: KALEABARU"
                    value={promoCodeInput}
                    onChange={(e) => {
                      setPromoCodeInput(e.target.value);
                      setPromoError('');
                    }}
                    disabled={!!activePromoCode}
                    className="w-full text-xs font-medium text-[#2D3436] bg-white border border-[#EDF2F7] rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8D6E63] disabled:opacity-60 disabled:bg-[#F1F3F5] uppercase"
                  />
                </div>
                {activePromoCode ? (
                  <button
                    id="remove-promo-button"
                    onClick={handleRemovePromo}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-200 transition-colors"
                  >
                    Batal
                  </button>
                ) : (
                  <button
                    id="apply-promo-button"
                    onClick={handleApplyPromo}
                    className="bg-[#2D3436] hover:bg-black text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    Gunakan
                  </button>
                )}
              </div>

              {promoError && (
                <p className="text-[10px] text-rose-500 font-medium ml-1">
                  {promoError}
                </p>
              )}

              {activePromoCode && (
                <div className="flex items-center justify-between text-xs font-semibold text-[#8D6E63] bg-[#8D6E63]/10 border border-[#8D6E63]/20 px-3 py-2 rounded-xl">
                  <span className="flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5" />
                    Kode {activePromoCode} Terpasang (10% Off)
                  </span>
                  <span className="text-[10px] font-mono font-bold">-{formatPrice(discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Price Detail Breakdowns */}
            <div className="space-y-1.5 text-xs text-[#636E72] font-medium">
              <div className="flex justify-between">
                <span>Subtotal Pesanan</span>
                <span className="font-mono text-[#2D3436]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>PPN (10%)</span>
                <span className="font-mono text-[#2D3436]">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan</span>
                <span className="font-mono text-[#2D3436]">{formatPrice(serviceCharge)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon Promo ({discountPercent}%)</span>
                  <span className="font-mono font-bold">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-dashed border-[#EDF2F7] flex justify-between items-center text-sm font-bold text-[#2D3436]">
                <span>Total Pembayaran</span>
                <span className="text-base text-[#8D6E63] font-mono">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Go to Checkout CTA */}
            <button
              id="proceed-to-payment-button"
              onClick={() => onCheckout(discountPercent, activePromoCode)}
              className="w-full bg-[#2D3436] hover:bg-black text-white font-semibold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-lg active:scale-95"
            >
              <span>Lanjut Ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
