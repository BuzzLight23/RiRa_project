// Tipe untuk Produk (Kerupuk/Kemplang)
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
  outlet_id: string; // Sesuai koreksi kamu
  quantity: number;
  total_amount: number;
  created_at: string;
  // Relasi (Join)
  products?: Product; // Akan terisi jika kita join
  outlets?: Outlet;   // Akan terisi jika kita join
}

// Tipe untuk Transaksi Keluar (Belanja Bahan)
export interface ExpenseTransaction {
  id: string;
  description: string;
  amount: number;
  created_at: string;
}