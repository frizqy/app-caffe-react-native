export type Category = 'Semua' | 'Kopi' | 'Non-Kopi' | 'Makanan' | 'Cemilan';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  rating: number;
  popular?: boolean;
  options?: {
    temperatures?: ('Panas' | 'Dingin')[];
    sugarLevels?: ('No Sugar' | 'Less Sugar' | 'Normal' | 'Extra Sugar')[];
    sizes?: ('Regular' | 'Large')[];
  };
}

export interface CartItem {
  id: string; // unique cart item id (combines menu item id + options)
  menuItem: MenuItem;
  quantity: number;
  selectedTemperature?: 'Panas' | 'Dingin';
  selectedSugarLevel?: 'No Sugar' | 'Less Sugar' | 'Normal' | 'Extra Sugar';
  selectedSize?: 'Regular' | 'Large';
  notes?: string;
}

export type PaymentMethodType = 'QRIS' | 'KARTU' | 'E_WALLET' | 'TUNAI';

export interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  iconName: string;
  description: string;
}
