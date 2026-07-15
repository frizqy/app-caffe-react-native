import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // KOPI
  {
    id: 'kopi-1',
    name: 'Café Latte Premium',
    description: 'Espresso double-shot dari biji kopi Arabika lokal dengan susu segar creamy berbusa lembut.',
    price: 32000,
    category: 'Kopi',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    popular: true,
    options: {
      temperatures: ['Panas', 'Dingin'],
      sugarLevels: ['No Sugar', 'Less Sugar', 'Normal', 'Extra Sugar'],
      sizes: ['Regular', 'Large']
    }
  },
  {
    id: 'kopi-2',
    name: 'Iced Caramel Macchiato',
    description: 'Perpaduan espresso kental, susu dingin, sirup vanilla, dan saus karamel lezat di atasnya.',
    price: 38000,
    category: 'Kopi',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    popular: true,
    options: {
      temperatures: ['Dingin'],
      sugarLevels: ['Less Sugar', 'Normal', 'Extra Sugar'],
      sizes: ['Regular', 'Large']
    }
  },
  {
    id: 'kopi-3',
    name: 'Kopi Susu Gula Aren',
    description: 'Espresso racikan khas dengan susu segar manis gurih dan gula aren murni organik.',
    price: 28000,
    category: 'Kopi',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    options: {
      temperatures: ['Panas', 'Dingin'],
      sugarLevels: ['Less Sugar', 'Normal', 'Extra Sugar'],
      sizes: ['Regular', 'Large']
    }
  },
  {
    id: 'kopi-4',
    name: 'Espresso Solo',
    description: 'Ekstraksi murni biji kopi single origin terpilih, pekat, beraroma kuat dengan crema tebal.',
    price: 22000,
    category: 'Kopi',
    image: 'https://images.unsplash.com/photo-1510707513156-46c4974f88c5?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    options: {
      temperatures: ['Panas'],
      sizes: ['Regular']
    }
  },

  // NON-KOPI
  {
    id: 'non-kopi-1',
    name: 'Uji Matcha Latte',
    description: 'Matcha hijau khas Jepang grade premium yang dipadukan dengan steamed milk lembut.',
    price: 35000,
    category: 'Non-Kopi',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    popular: true,
    options: {
      temperatures: ['Panas', 'Dingin'],
      sugarLevels: ['No Sugar', 'Less Sugar', 'Normal'],
      sizes: ['Regular', 'Large']
    }
  },
  {
    id: 'non-kopi-2',
    name: 'Strawberry Sparkling Ade',
    description: 'Konsentrat buah stroberi segar berpadu dengan air soda dingin dan daun mint penyegar.',
    price: 30000,
    category: 'Non-Kopi',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    options: {
      temperatures: ['Dingin'],
      sugarLevels: ['Less Sugar', 'Normal'],
      sizes: ['Regular']
    }
  },
  {
    id: 'non-kopi-3',
    name: 'Classic Velvet Chocolate',
    description: 'Cokelat Belgia premium pekat yang disajikan hangat dengan taburan bubuk cokelat di atasnya.',
    price: 34000,
    category: 'Non-Kopi',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    options: {
      temperatures: ['Panas', 'Dingin'],
      sugarLevels: ['Less Sugar', 'Normal', 'Extra Sugar'],
      sizes: ['Regular', 'Large']
    }
  },

  // MAKANAN
  {
    id: 'makanan-1',
    name: 'Smoked Beef Lasagna',
    description: 'Lembaran pasta lembut dengan saus bolognese daging sapi cincang mewah, krim béchamel, dan keju mozzarella leleh.',
    price: 48000,
    category: 'Makanan',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    popular: true
  },
  {
    id: 'makanan-2',
    name: 'Spaghetti Aglio Olio',
    description: 'Pasta spaghetti yang ditumis dengan minyak zaitun premium, bawang putih, serpihan cabai kering, dan potongan ayam panggang.',
    price: 45000,
    category: 'Makanan',
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&q=80&w=600',
    rating: 4.6
  },

  // CEMILAN
  {
    id: 'cemilan-1',
    name: 'Butter Croissant',
    description: 'Pastry khas Perancis yang dipanggang segar setiap pagi dengan mentega premium menghasilkan lapisan renyah dan lembut.',
    price: 25000,
    category: 'Cemilan',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    popular: true
  },
  {
    id: 'cemilan-2',
    name: 'Truffle Parmesan Fries',
    description: 'Kentang goreng renyah dibaluri minyak truffle aromatik, garam laut berkualitas, dan taburan keju parmesan parut.',
    price: 29000,
    category: 'Cemilan',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
    rating: 4.7
  },
  {
    id: 'cemilan-3',
    name: 'Cinnamon Roll Glaze',
    description: 'Roti gulung lembut dengan isian bubuk kayu manis wangi, ditutup dengan krim keju frosting manis lembut.',
    price: 27000,
    category: 'Cemilan',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    rating: 4.6
  }
];
