import { useState } from 'react';
import { Coffee, ShoppingBasket, CreditCard, ChevronRight, Wifi, Battery, Signal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, MenuItem, PaymentMethodType } from './types';
import MenuTab from './components/MenuTab';
import CartTab from './components/CartTab';
import PaymentTab from './components/PaymentTab';
import CustomizationModal from './components/CustomizationModal';
import ReceiptModal from './components/ReceiptModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'payment'>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Checkout & Promo States
  const [promoCodeApplied, setPromoCodeApplied] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Success Receipt States
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [lastPaymentMethod, setLastPaymentMethod] = useState<PaymentMethodType>('QRIS');
  const [cardName, setCardName] = useState<string | undefined>(undefined);
  const [walletPhone, setWalletPhone] = useState<string | undefined>(undefined);

  // Cart item managers
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === newItem.id);
      if (existingIndex > -1) {
        // Increment quantity of existing item with the exact same customizations
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += newItem.quantity;
        return updatedCart;
      }
      return [...prevCart, newItem];
    });
  };

  const handleUpdateQuantity = (id: string, amount: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + amount;
            return { ...item, quantity: Math.max(1, nextQty) };
          }
          return item;
        })
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCheckout = (promoDiscount: number, promoCode: string) => {
    setDiscountPercent(promoDiscount);
    setPromoCodeApplied(promoCode);
    setActiveTab('payment');
  };

  const handlePaymentSuccess = (
    method: PaymentMethodType,
    holderName?: string,
    phoneNum?: string
  ) => {
    // Generate a beautiful, realistic queue/order number
    const queueCode = `KL-${Math.floor(100 + Math.random() * 900)}`;
    setOrderNumber(queueCode);
    setLastPaymentMethod(method);
    setCardName(holderName);
    setWalletPhone(phoneNum);
    setIsReceiptOpen(true);
  };

  const handleNewOrder = () => {
    // Full reset state
    setCart([]);
    setDiscountPercent(0);
    setPromoCodeApplied('');
    setIsReceiptOpen(false);
    setActiveTab('menu');
  };

  // Helper calculation for total cart badge count
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Pricing helper
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
  const tax = Math.round(subtotal * 0.1);
  const serviceCharge = subtotal > 0 ? 2000 : 0;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const grandTotal = subtotal + tax + serviceCharge - discountAmount;

  // Get current mobile time
  const mobileTimeStr = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center py-6 px-4 md:py-10 select-none antialiased font-sans">
      
      {/* Decorative ambient background lights */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] aspect-square bg-[#8D6E63]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] aspect-square bg-[#2D3436]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Phone Frame Simulator */}
      <div className="w-full max-w-md bg-[#000000] rounded-[52px] p-3.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] border border-[#EDF2F7] relative overflow-hidden aspect-[9/19.5] max-h-[880px] flex flex-col">
        
        {/* Phone Frame Speaker and Dynamic Island notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-900 rounded-full mb-1" />
        </div>

        {/* Inner Phone Screen */}
        <div className="w-full h-full bg-white rounded-[38px] overflow-hidden relative flex flex-col border border-slate-900/5">
          
          {/* Simulated iOS Status Bar */}
          <div className="h-10 pt-3 px-6 flex justify-between items-center bg-white text-[#2D3436] z-30 select-none shrink-0">
            <span className="text-[11px] font-bold tracking-tight font-mono">{mobileTimeStr}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-[#2D3436]" />
              <span className="text-[10px] font-bold">4G</span>
              <Wifi className="w-3.5 h-3.5 text-[#2D3436]" />
              <div className="flex items-center gap-0.5">
                <Battery className="w-4 h-4 text-[#2D3436]" />
              </div>
            </div>
          </div>

          {/* Core Tab Render Engine */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {activeTab === 'menu' && (
                <motion.div
                  key="menu-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-full h-full"
                >
                  <MenuTab onSelectItem={(item) => setSelectedItem(item)} />
                </motion.div>
              )}

              {activeTab === 'cart' && (
                <motion.div
                  key="cart-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-full h-full"
                >
                  <CartTab
                    cart={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onCheckout={handleCheckout}
                    onGoToMenu={() => setActiveTab('menu')}
                  />
                </motion.div>
              )}

              {activeTab === 'payment' && (
                <motion.div
                  key="payment-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-full h-full"
                >
                  <PaymentTab
                    totalAmount={grandTotal}
                    promoCodeApplied={promoCodeApplied}
                    onBackToCart={() => setActiveTab('cart')}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Floating Bottom Quick Cart Peek Bar (Shown when on Menu tab and cart contains items) */}
          {activeTab === 'menu' && cart.length > 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={() => setActiveTab('cart')}
              className="absolute bottom-22 left-4 right-4 bg-[#2D3436] text-white rounded-2xl p-4 flex justify-between items-center shadow-lg hover:bg-black cursor-pointer transition-all active:scale-95 z-20 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#8D6E63] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono">
                  {totalCartCount}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Lihat Keranjang Belanja</h4>
                  <p className="text-[10px] text-[#EDF2F7] mt-0.5">Sudah siap memesan minumanmu?</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold font-mono">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(grandTotal)}
                </span>
                <ChevronRight className="w-4 h-4 text-[#8D6E63]" />
              </div>
            </motion.div>
          )}

          {/* Bottom Native Tab Navigation Bar */}
          <div className="h-20 bg-white border-t border-[#EDF2F7] flex justify-around items-center px-4 pb-4 shrink-0 z-20">
            {/* MENU TAB BUTTON */}
            <button
              id="bottom-nav-menu"
              onClick={() => setActiveTab('menu')}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
                activeTab === 'menu' ? 'text-[#8D6E63] scale-105' : 'text-[#636E72] hover:text-[#2D3436]'
              }`}
            >
              <Coffee className="w-5.5 h-5.5" />
              <span className="text-[10px] font-bold">Katalog</span>
            </button>

            {/* CART TAB BUTTON WITH BADGE */}
            <button
              id="bottom-nav-cart"
              onClick={() => setActiveTab('cart')}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all relative ${
                activeTab === 'cart' ? 'text-[#8D6E63] scale-105' : 'text-[#636E72] hover:text-[#2D3436]'
              }`}
            >
              <ShoppingBasket className="w-5.5 h-5.5" />
              <span className="text-[10px] font-bold">Pesanan</span>
              {totalCartCount > 0 && (
                <span className="absolute top-0 right-2 bg-rose-500 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white font-mono shadow-xs animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* PAYMENT TAB BUTTON */}
            <button
              id="bottom-nav-payment"
              onClick={() => {
                if (cart.length === 0) {
                  alert('Pilih beberapa menu terlebih dahulu sebelum lanjut ke halaman pembayaran.');
                  return;
                }
                setActiveTab('payment');
              }}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
                activeTab === 'payment' ? 'text-[#8D6E63] scale-105' : 'text-[#636E72] hover:text-[#2D3436]'
              } ${cart.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <CreditCard className="w-5.5 h-5.5" />
              <span className="text-[10px] font-bold">Pembayaran</span>
            </button>
          </div>

          {/* Customization bottom sheet modal */}
          <CustomizationModal
            isOpen={selectedItem !== null}
            onClose={() => setSelectedItem(null)}
            menuItem={selectedItem}
            onAddToCart={handleAddToCart}
          />

          {/* Interactive success payment receipt modal */}
          <ReceiptModal
            isOpen={isReceiptOpen}
            orderNumber={orderNumber}
            cart={cart}
            subtotal={subtotal}
            tax={tax}
            serviceCharge={serviceCharge}
            discountAmount={discountAmount}
            grandTotal={grandTotal}
            paymentMethod={lastPaymentMethod}
            cardName={cardName}
            walletPhone={walletPhone}
            onNewOrder={handleNewOrder}
          />

        </div>
      </div>
    </div>
  );
}
