import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, QrCode, Wallet, Landmark, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import { PaymentMethodType } from '../types';

interface PaymentTabProps {
  totalAmount: number;
  promoCodeApplied: string;
  onBackToCart: () => void;
  onPaymentSuccess: (method: PaymentMethodType, cardName?: string, walletPhone?: string) => void;
}

export default function PaymentTab({
  totalAmount,
  promoCodeApplied,
  onBackToCart,
  onPaymentSuccess,
}: PaymentTabProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('QRIS');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Credit Card Form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardFocus, setCardFocus] = useState<'number' | 'name' | 'expiry' | 'cvv' | null>(null);

  // E-Wallet States
  const [selectedWallet, setSelectedWallet] = useState<'GoPay' | 'OVO' | 'DANA' | 'ShopeePay'>('GoPay');
  const [walletPhone, setWalletPhone] = useState('');

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format Credit Card input helpers
  const handleCardNumberChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 16);
    const parts = clean.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : '');
  };

  const handleExpiryChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 4);
    if (clean.length > 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  const handleCvvChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 3);
    setCardCvv(clean);
  };

  const handlePaymentSubmit = () => {
    // Validations based on selected method
    if (selectedMethod === 'KARTU') {
      if (cardNumber.length < 19 || !cardName || cardExpiry.length < 5 || cardCvv.length < 3) {
        alert('Mohon lengkapi seluruh data kartu debit/kredit Anda.');
        return;
      }
    } else if (selectedMethod === 'E_WALLET') {
      if (walletPhone.length < 10) {
        alert('Mohon masukkan nomor HP E-Wallet yang valid (minimal 10 digit).');
        return;
      }
    }

    setIsSubmitting(true);

    // Simulate 1.5s transaction auth
    setTimeout(() => {
      setIsSubmitting(false);
      onPaymentSuccess(selectedMethod, cardName || undefined, walletPhone || undefined);
    }, 1800);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA]">
      {/* Top sticky navigation */}
      <div className="p-6 bg-white border-b border-[#EDF2F7] sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <button
          id="back-to-cart-button"
          onClick={onBackToCart}
          className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#2D3436]" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-[#2D3436] tracking-tight">Metode Pembayaran</h1>
          <p className="text-xs text-[#636E72] mt-0.5 font-medium">Langkah terakhir menyelesaikan pesanan Anda</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
        {/* Cost Summary Box */}
        <div className="bg-[#2D3436] rounded-[24px] p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-[#8D6E63]/15 rounded-full blur-xl" />
          <div className="absolute left-[-20px] bottom-[-20px] w-32 h-32 bg-black/25 rounded-full blur-xl" />

          <div className="relative z-10 flex justify-between items-center font-sans">
            <div>
              <span className="text-[10px] text-[#EDF2F7] uppercase font-semibold tracking-wider opacity-90">Total Tagihan</span>
              <div className="text-2xl font-black font-mono mt-1">{formatPrice(totalAmount)}</div>
            </div>
            {promoCodeApplied && (
              <span className="bg-[#8D6E63]/30 text-white border border-[#8D6E63]/40 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                Promo: {promoCodeApplied}
              </span>
            )}
          </div>
        </div>

        {/* List of Payment Methods */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#2D3436]">Pilih Cara Pembayaran</h3>

          <div className="grid grid-cols-2 gap-3">
            {/* QRIS METHOD CARD */}
            <button
              id="payment-method-qris"
              onClick={() => setSelectedMethod('QRIS')}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                selectedMethod === 'QRIS'
                  ? 'border-[#8D6E63] bg-[#8D6E63]/5 shadow-sm ring-1 ring-[#8D6E63]'
                  : 'border-[#EDF2F7] bg-white hover:border-slate-300'
              }`}
            >
              <QrCode className={`w-5 h-5 ${selectedMethod === 'QRIS' ? 'text-[#8D6E63]' : 'text-slate-400'} mb-2`} />
              <div className="font-bold text-xs text-[#2D3436]">QRIS Instan</div>
              <div className="text-[10px] text-[#636E72] mt-0.5">E-Wallet & m-Banking</div>
              {selectedMethod === 'QRIS' && (
                <span className="absolute top-2 right-2 bg-[#8D6E63] text-white rounded-full p-0.5">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </button>

            {/* E-WALLET METHOD CARD */}
            <button
              id="payment-method-ewallet"
              onClick={() => setSelectedMethod('E_WALLET')}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                selectedMethod === 'E_WALLET'
                  ? 'border-[#8D6E63] bg-[#8D6E63]/5 shadow-sm ring-1 ring-[#8D6E63]'
                  : 'border-[#EDF2F7] bg-white hover:border-slate-300'
              }`}
            >
              <Wallet className={`w-5 h-5 ${selectedMethod === 'E_WALLET' ? 'text-[#8D6E63]' : 'text-slate-400'} mb-2`} />
              <div className="font-bold text-xs text-[#2D3436]">E-Wallet</div>
              <div className="text-[10px] text-[#636E72] mt-0.5">GoPay, OVO, DANA</div>
              {selectedMethod === 'E_WALLET' && (
                <span className="absolute top-2 right-2 bg-[#8D6E63] text-white rounded-full p-0.5">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </button>

            {/* CREDIT CARD METHOD CARD */}
            <button
              id="payment-method-card"
              onClick={() => setSelectedMethod('KARTU')}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                selectedMethod === 'KARTU'
                  ? 'border-[#8D6E63] bg-[#8D6E63]/5 shadow-sm ring-1 ring-[#8D6E63]'
                  : 'border-[#EDF2F7] bg-white hover:border-slate-300'
              }`}
            >
              <CreditCard className={`w-5 h-5 ${selectedMethod === 'KARTU' ? 'text-[#8D6E63]' : 'text-slate-400'} mb-2`} />
              <div className="font-bold text-xs text-[#2D3436]">Kartu Kredit/Debit</div>
              <div className="text-[10px] text-[#636E72] mt-0.5">Visa, Mastercard, GPN</div>
              {selectedMethod === 'KARTU' && (
                <span className="absolute top-2 right-2 bg-[#8D6E63] text-white rounded-full p-0.5">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </button>

            {/* CASH ON CASHIER METHOD CARD */}
            <button
              id="payment-method-tunai"
              onClick={() => setSelectedMethod('TUNAI')}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                selectedMethod === 'TUNAI'
                  ? 'border-[#8D6E63] bg-[#8D6E63]/5 shadow-sm ring-1 ring-[#8D6E63]'
                  : 'border-[#EDF2F7] bg-white hover:border-slate-300'
              }`}
            >
              <Landmark className={`w-5 h-5 ${selectedMethod === 'TUNAI' ? 'text-[#8D6E63]' : 'text-slate-400'} mb-2`} />
              <div className="font-bold text-xs text-[#2D3436]">Bayar Di Kasir</div>
              <div className="text-[10px] text-[#636E72] mt-0.5">Tunai & Mesin EDC</div>
              {selectedMethod === 'TUNAI' && (
                <span className="absolute top-2 right-2 bg-[#8D6E63] text-white rounded-full p-0.5">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Conditional Details Section */}
        <div className="bg-white border border-[#EDF2F7] rounded-2xl p-5 shadow-sm">
          <AnimatePresence mode="wait">
            {/* 1. QRIS CONTENT */}
            {selectedMethod === 'QRIS' && (
              <motion.div
                key="qris-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                {/* QRIS Header */}
                <div className="w-full flex justify-between items-center pb-3 border-b border-[#EDF2F7]">
                  <span className="text-[11px] font-black text-[#2D3436] bg-[#F1F3F5] px-2.5 py-1 rounded-md tracking-wider">QRIS GPN</span>
                  <span className="text-[10px] text-[#636E72] font-semibold uppercase tracking-wider">Pembayaran Instan</span>
                </div>

                {/* Simulated QR Code Wrapper */}
                <div className="bg-white border-2 border-[#EDF2F7] p-4 rounded-2xl relative shadow-inner">
                  {/* Stylized QR Matrix utilizing an SVG mockup representing a genuine complex QR code */}
                  <svg className="w-48 h-48" viewBox="0 0 100 100">
                    {/* Corners outer rings */}
                    <rect x="5" y="5" width="20" height="20" fill="none" stroke="#000" strokeWidth="4" />
                    <rect x="5" y="75" width="20" height="20" fill="none" stroke="#000" strokeWidth="4" />
                    <rect x="75" y="5" width="20" height="20" fill="none" stroke="#000" strokeWidth="4" />
                    {/* Corners inner solid blocks */}
                    <rect x="10" y="10" width="10" height="10" fill="#000" />
                    <rect x="10" y="80" width="10" height="10" fill="#000" />
                    <rect x="80" y="10" width="10" height="10" fill="#000" />
                    {/* Random mockup QR blocks */}
                    <path
                      d="M 35,10 H 45 V 20 H 35 Z M 55,10 H 65 V 15 H 55 Z M 35,25 H 40 V 35 H 35 Z M 45,30 H 55 V 40 H 45 Z M 60,25 H 70 V 35 H 60 Z M 10,35 H 20 V 45 H 10 Z M 25,40 H 35 V 50 H 25 Z M 40,45 H 50 V 55 H 40 Z M 55,45 H 65 V 55 H 55 Z M 70,40 H 80 V 50 H 70 Z M 85,35 H 90 V 45 H 85 Z M 10,55 H 15 V 65 H 10 Z M 20,60 H 30 V 70 H 20 Z M 35,55 H 45 V 65 H 35 Z M 50,60 H 60 V 70 H 50 Z M 65,55 H 75 V 65 H 65 Z M 80,60 H 90 V 70 H 80 Z M 35,75 H 45 V 85 H 35 Z M 55,75 H 65 V 85 H 55 Z M 45,85 H 55 V 90 H 45 Z M 75,75 H 80 V 85 H 75 Z"
                      fill="#1e293b"
                    />
                    {/* Tiny Center Icon Backdrop */}
                    <rect x="42" y="42" width="16" height="16" rx="3" fill="#ffffff" />
                    <circle cx="50" cy="50" r="5" fill="#8D6E63" />
                  </svg>

                  {/* Simulated QR Scan overlay animation */}
                  <motion.div
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="absolute left-4 right-4 h-0.5 bg-[#8D6E63] shadow-[0_0_8px_#8D6E63]"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#2D3436]">Kode QR Diperbarui Otomatis</p>
                  <p className="text-[10px] text-[#636E72] max-w-[280px]">
                    Simpan kode QR di atas atau langsung scan menggunakan GoPay, ShopeePay, OVO, DANA, LinkAja, atau m-Banking Anda.
                  </p>
                </div>

                {/* Scan Simulator status */}
                <div className="w-full bg-[#F1F3F5] border border-[#EDF2F7] rounded-xl p-3 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8D6E63] animate-ping" />
                  <span className="text-[10px] text-[#8D6E63] font-bold tracking-wide uppercase">Menunggu Pembayaran...</span>
                </div>
              </motion.div>
            )}

            {/* 2. CREDIT CARD CONTENT */}
            {selectedMethod === 'KARTU' && (
              <motion.div
                key="card-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Simulated Luxury Credit Card Graphic */}
                <div className="w-full aspect-[1.586/1] bg-gradient-to-br from-[#2D3436] to-[#8D6E63] rounded-2xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between font-sans border border-[#EDF2F7]/10">
                  {/* Holographic glowing orb background */}
                  <div className="absolute right-[-40px] top-[-40px] w-48 h-48 bg-[#8D6E63]/20 rounded-full blur-2xl" />
                  <div className="absolute left-[-20px] bottom-[-20px] w-48 h-48 bg-black/10 rounded-full blur-2xl" />

                  {/* Card Type & Chip */}
                  <div className="flex justify-between items-start relative z-10">
                    {/* Metallic Chip */}
                    <div className="w-10 h-8 bg-gradient-to-br from-[#EDF2F7] to-[#636E72]/40 rounded-md relative overflow-hidden shadow-inner">
                      <div className="absolute inset-0.5 border border-[#2D3436]/20 rounded" />
                      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#2D3436]/20" />
                      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#2D3436]/20" />
                    </div>

                    <span className="text-sm font-black tracking-widest italic text-[#EDF2F7] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-[#8D6E63] text-[#8D6E63] animate-pulse" />
                      KALEA PLATINUM
                    </span>
                  </div>

                  {/* Card Number */}
                  <div className="relative z-10 py-2">
                    <span className="text-sm font-mono tracking-[4px] text-white/90 text-shadow-sm">
                      {cardNumber || '••••  ••••  ••••  ••••'}
                    </span>
                  </div>

                  {/* Expiration & Holder Name */}
                  <div className="relative z-10 flex justify-between items-end">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-slate-300 block">Nama Pemegang Kartu</span>
                      <span className="text-xs font-bold tracking-wide uppercase text-white truncate max-w-[160px] block mt-0.5">
                        {cardName || 'NAMA LENGKAP'}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-right">
                        <span className="text-[8px] uppercase tracking-wider text-slate-300 block">Masa Berlaku</span>
                        <span className="text-xs font-mono font-semibold text-white block mt-0.5">
                          {cardExpiry || 'MM/YY'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] uppercase tracking-wider text-slate-300 block">CVV</span>
                        <span className="text-xs font-mono font-semibold text-white block mt-0.5">
                          {cardFocus === 'cvv' ? cardCvv : '•••'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Input Fields */}
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-bold text-[#636E72] uppercase tracking-wider block mb-1">Nomor Kartu</label>
                    <input
                      id="input-card-number"
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      onFocus={() => setCardFocus('number')}
                      onBlur={() => setCardFocus(null)}
                      className="w-full text-xs bg-[#F8F9FA] border border-[#EDF2F7] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1.5 focus:ring-[#8D6E63] focus:bg-white transition-all font-mono placeholder:text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#636E72] uppercase tracking-wider block mb-1">Nama Di Kartu</label>
                    <input
                      id="input-card-name"
                      type="text"
                      placeholder="Contoh: Frizqy Mahrizal"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      onFocus={() => setCardFocus('name')}
                      onBlur={() => setCardFocus(null)}
                      className="w-full text-xs bg-[#F8F9FA] border border-[#EDF2F7] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1.5 focus:ring-[#8D6E63] focus:bg-white transition-all font-medium uppercase placeholder:text-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-[#636E72] uppercase tracking-wider block mb-1">Berlaku S/D</label>
                      <input
                        id="input-card-expiry"
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        onFocus={() => setCardFocus('expiry')}
                        onBlur={() => setCardFocus(null)}
                        className="w-full text-xs bg-[#F8F9FA] border border-[#EDF2F7] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1.5 focus:ring-[#8D6E63] focus:bg-white transition-all font-mono text-center placeholder:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#636E72] uppercase tracking-wider block mb-1">CVV</label>
                      <input
                        id="input-card-cvv"
                        type="password"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => handleCvvChange(e.target.value)}
                        onFocus={() => setCardFocus('cvv')}
                        onBlur={() => setCardFocus(null)}
                        className="w-full text-xs bg-[#F8F9FA] border border-[#EDF2F7] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1.5 focus:ring-[#8D6E63] focus:bg-white transition-all font-mono text-center placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. E-WALLET CONTENT */}
            {selectedMethod === 'E_WALLET' && (
              <motion.div
                key="ewallet-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Select specific wallet */}
                <div className="grid grid-cols-4 gap-2">
                  {(['GoPay', 'OVO', 'DANA', 'ShopeePay'] as const).map((wallet) => (
                    <button
                      key={wallet}
                      id={`wallet-choice-${wallet}`}
                      onClick={() => setSelectedWallet(wallet)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                        selectedWallet === wallet
                          ? 'border-[#8D6E63] bg-[#8D6E63]/5 shadow-xs'
                          : 'border-[#EDF2F7] hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-[10px] font-extrabold text-[#2D3436]">{wallet}</span>
                    </button>
                  ))}
                </div>

                {/* Phone number field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#636E72] uppercase tracking-wider block">
                    Nomor HP Terdaftar ({selectedWallet})
                  </label>
                  <input
                    id="input-wallet-phone"
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs bg-[#F8F9FA] border border-[#EDF2F7] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1.5 focus:ring-[#8D6E63] focus:bg-white transition-all font-mono font-medium"
                  />
                </div>

                {/* Notification advisory */}
                <div className="bg-[#8D6E63]/10 border border-[#8D6E63]/20 rounded-xl p-3.5 flex gap-2.5 items-start">
                  <AlertCircle className="w-4 h-4 text-[#8D6E63] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[#2D3436] leading-relaxed font-medium">
                    Pastikan saldo {selectedWallet} Anda mencukupi. Setelah mengonfirmasi pembayaran, Anda akan menerima push notification langsung di ponsel Anda untuk otentikasi PIN transaksi.
                  </p>
                </div>
              </motion.div>
            )}

            {/* 4. TUNAI CONTENT */}
            {selectedMethod === 'TUNAI' && (
              <motion.div
                key="tunai-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 text-center py-4"
              >
                <div className="w-12 h-12 bg-[#8D6E63]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Landmark className="w-6 h-6 text-[#8D6E63]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[#2D3436]">Selesaikan di Meja Kasir</h4>
                  <p className="text-[11px] text-[#636E72] max-w-[280px] mx-auto leading-relaxed">
                    Pesanan Anda akan langsung diproses ke sistem dapur setelah menekan tombol konfirmasi. Silakan sebutkan nama pesanan Anda di kasir untuk menyelesaikan pembayaran.
                  </p>
                </div>

                <div className="bg-[#F8F9FA] border border-[#EDF2F7] rounded-xl p-3 text-left">
                  <span className="text-[9px] uppercase tracking-wider text-[#636E72] font-bold block">Metode Kasir yang Diterima:</span>
                  <div className="flex gap-2.5 mt-1.5 text-[10px] font-semibold text-[#636E72]">
                    <span className="bg-white border border-[#EDF2F7] px-2 py-0.5 rounded-md">💵 Uang Tunai</span>
                    <span className="bg-white border border-[#EDF2F7] px-2 py-0.5 rounded-md">💳 Debit / Kredit EDC</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Confirmation Bottom Action Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#EDF2F7] p-4 px-6 shadow-xl">
        <button
          id="confirm-payment-button"
          onClick={handlePaymentSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#2D3436] hover:bg-black text-white font-semibold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-lg active:scale-95 disabled:opacity-85"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Memproses Transaksi...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span>Konfirmasi & Bayar</span>
              <span className="font-mono font-bold ml-1">{formatPrice(totalAmount)}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
