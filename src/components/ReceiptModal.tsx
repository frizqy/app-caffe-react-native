import { motion } from 'motion/react';
import { Check, ArrowRight, Printer, Share2, Sparkles } from 'lucide-react';
import { CartItem, PaymentMethodType } from '../types';

interface ReceiptModalProps {
  isOpen: boolean;
  orderNumber: string;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discountAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethodType;
  cardName?: string;
  walletPhone?: string;
  onNewOrder: () => void;
}

export default function ReceiptModal({
  isOpen,
  orderNumber,
  cart,
  subtotal,
  tax,
  serviceCharge,
  discountAmount,
  grandTotal,
  paymentMethod,
  cardName,
  walletPhone,
  onNewOrder,
}: ReceiptModalProps) {
  if (!isOpen) return null;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case 'QRIS':
        return 'QRIS Instan (E-Wallet)';
      case 'E_WALLET':
        return `E-Wallet (${walletPhone ? `HP: ${walletPhone.slice(0, 4)}...${walletPhone.slice(-4)}` : 'GoPay/OVO/DANA'})`;
      case 'KARTU':
        return `Kartu Kredit/Debit (${cardName ? cardName.toUpperCase() : 'PLATINUM'})`;
      case 'TUNAI':
        return 'Tunai di Meja Kasir';
      default:
        return 'Pembayaran';
    }
  };

  const todayStr = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date());

  return (
    <div className="fixed inset-0 bg-[#2D3436]/90 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-6">
      {/* Container wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        {/* Animated Checkmark Bubble */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-16 h-16 bg-[#8D6E63] rounded-full flex items-center justify-center shadow-lg shadow-[#8D6E63]/25 mb-6 z-10"
        >
          <Check className="w-8 h-8 text-white stroke-[3px]" />
        </motion.div>

        {/* Success message */}
        <div className="text-center mb-5">
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>Pembayaran Berhasil!</span>
            <Sparkles className="w-5 h-5 text-[#8D6E63] fill-[#8D6E63] animate-pulse" />
          </h2>
          <p className="text-xs text-[#EDF2F7] mt-1 opacity-90">Pesanan Anda telah diteruskan ke dapur Kalea Café.</p>
        </div>

        {/* Thermal Receipt Card */}
        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-[#EDF2F7] p-6 flex flex-col font-sans">
          {/* Top Receipt Decorative Cut */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#8D6E63]" />

          {/* Receipt Header details */}
          <div className="text-center pb-5 border-b border-dashed border-slate-200">
            <h3 className="text-sm font-black text-[#2D3436] tracking-wider">KALEA CAFÉ & ROASTERY</h3>
            <p className="text-[10px] text-[#636E72] mt-0.5">Grand Indonesia, Lantai 3, Jakarta</p>
            <p className="text-[10px] text-[#636E72]">Telp: (021) 849-0128</p>

            {/* Receipt metadata */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-left text-[10px] font-medium text-[#636E72] bg-[#F8F9FA] rounded-xl p-2.5 border border-[#EDF2F7]">
              <div>
                <span className="block text-[#636E72]/75">Kode Antrean</span>
                <span className="text-xs font-bold font-mono text-[#2D3436]">{orderNumber}</span>
              </div>
              <div className="text-right">
                <span className="block text-[#636E72]/75">Waktu Order</span>
                <span className="text-xs font-bold text-[#2D3436]">{todayStr}</span>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="py-4 border-b border-dashed border-slate-200 space-y-3 max-h-[180px] overflow-y-auto">
            {cart.map((item) => {
              const itemPrice = item.menuItem.price + (item.selectedSize === 'Large' ? 5000 : 0);
              const itemTotal = itemPrice * item.quantity;

              return (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-[#2D3436] block">
                      {item.menuItem.name}
                    </span>
                    {/* Tiny specs line */}
                    {(item.selectedTemperature || item.selectedSize || item.selectedSugarLevel) && (
                      <span className="text-[9px] text-[#636E72] font-medium block mt-0.5">
                        {item.selectedTemperature ? `${item.selectedTemperature} • ` : ''}
                        {item.selectedSize ? `${item.selectedSize} • ` : ''}
                        {item.selectedSugarLevel ? `${item.selectedSugarLevel}` : ''}
                      </span>
                    )}
                    {/* Multiplier string */}
                    <span className="text-[10px] text-[#636E72] block font-mono mt-0.5">
                      {item.quantity} x {formatPrice(itemPrice)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#636E72] font-mono self-end">
                    {formatPrice(itemTotal)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Payment Method Breakdown */}
          <div className="py-3.5 border-b border-[#EDF2F7] text-xs">
            <div className="flex justify-between font-medium">
              <span className="text-[#636E72]">Metode Bayar</span>
              <span className="text-[#2D3436] font-semibold">{getPaymentMethodLabel()}</span>
            </div>
            <div className="flex justify-between font-medium mt-1">
              <span className="text-[#636E72]">Status</span>
              <span className="text-[#8D6E63] font-bold flex items-center gap-0.5">
                LUNAS
              </span>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="pt-3.5 space-y-1.5 text-[11px] text-[#636E72] font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
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
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#8D6E63]">
                <span>Diskon Promo</span>
                <span className="font-mono font-bold">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center text-sm font-bold text-[#2D3436]">
              <span>Total Dibayar</span>
              <span className="text-base text-[#8D6E63] font-mono">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Receipt footer message */}
          <div className="text-center pt-5 mt-4 border-t border-dashed border-slate-200 text-[10px] text-[#636E72] font-medium space-y-1">
            <p>Terima kasih atas pesanan Anda!</p>
            <p className="italic">Silakan tunjukkan Kode Antrean ke barista jika dipanggil.</p>
          </div>
        </div>

        {/* Action utility buttons below the receipt card */}
        <div className="flex gap-2.5 mt-5 w-full">
          <button
            id="print-receipt-button"
            onClick={() => alert('Fitur mencetak sedang dipersiapkan...')}
            className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/20 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak
          </button>
          <button
            id="share-receipt-button"
            onClick={() => alert('Fitur membagikan struk sedang dipersiapkan...')}
            className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/20 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" /> Bagikan
          </button>
        </div>

        {/* Big Reset / Place New Order Button */}
        <button
          id="new-order-reset-button"
          onClick={onNewOrder}
          className="w-full bg-[#8D6E63] hover:bg-[#70554C] text-white font-semibold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 mt-4 transition-all hover:scale-[1.01] shadow-lg active:scale-95 text-sm"
        >
          <span>Pesan Menu Baru</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
