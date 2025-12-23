// Tipe untuk Produk
export interface Product {
  id: string;
  name: string;
  price: number;
  created_at: string;
}

// Tipe untuk Warung/Outlet
export interface Outlet {
  id: string;
  name: string;
  created_at: string;
}

// Tipe untuk Transaksi Masuk (Penjualan)
export interface IncomeTransaction {
  id: string;
  product_id: string;
  outlet_id: string;
  quantity: number;
  total_amount: number;
  created_at: string;
  // Relasi (Join)
  products?: Product; 
  outlets?: Outlet;   
}

export interface ExpenseTransaction {
  id: string;
  description: string;
  amount: number;
  created_at: string;
}