import { createClient } from '@/lib/supabase/server'
import { addIncome, deleteTransaction } from './actions'
import { Wallet, Store, Package, Calculator, Save, Trash2, History, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function TransactionPage() {
  const supabase = await createClient()

  // 1. Ambil Data Master
  const { data: products } = await supabase.from('products').select('*').order('name')
  const { data: outlets } = await supabase.from('outlets').select('*').order('name')

  // 2. Ambil Riwayat Transaksi (Limit 20)
  const { data: transactions } = await supabase
    .from('income_transactions')
    .select(`
      id, quantity, total_amount, created_at,
      products (name, price),
      outlets (name)
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* HEADER FIXED */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
          {/* Tombol Kembali */}
          <Link href="/" className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
              <Wallet className="w-5 h-5" />
            </span>
            Input Penjualan
          </h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-8">
        
        {/* === FORM INPUT CARD === */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-blue-50/50 border-b border-blue-100">
            <h2 className="font-bold text-blue-800 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Catat Transaksi Baru
            </h2>
          </div>
          
          <div className="p-5">
            <form action={addIncome} className="space-y-5">
              
              {/* Field Warung */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Lokasi Warung</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-100 p-1.5 rounded-md">
                    <Store className="w-4 h-4 text-gray-500" />
                  </div>
                  <select name="outlet_id" required className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none font-medium text-gray-700">
                    <option value="">Pilih Warung...</option>
                    {outlets?.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4">
                {/* Field Produk */}
                <div className="col-span-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Produk</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-100 p-1.5 rounded-md">
                      <Package className="w-4 h-4 text-gray-500" />
                    </div>
                    <select name="product_id" required className="w-full pl-12 pr-8 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none font-medium text-gray-700">
                      <option value="">Pilih...</option>
                      {products?.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field Jumlah */}
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Jml</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-100 p-1.5 rounded-md">
                      <Calculator className="w-4 h-4 text-gray-500" />
                    </div>
                    <input name="quantity" type="number" min="1" placeholder="0" required className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-gray-800" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition flex justify-center items-center gap-2 text-sm mt-2">
                <Save className="w-5 h-5" /> Simpan Laporan
              </button>
            </form>
          </div>
        </div>

        {/* === DAFTAR RIWAYAT (Fixed) === */}
        <div>
          <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-5 px-1 text-lg">
            <History className="w-5 h-5 text-gray-500" /> Riwayat Terakhir
          </h3>

          <div className="flex flex-col gap-3">
            {transactions?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Belum ada transaksi hari ini.</p>
              </div>
            ) : (
              transactions?.map((trx: any) => (
                <div key={trx.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden flex items-stretch gap-4">
                  
                  {/* Bagian Kiri: Info Utama */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-bold text-gray-800 text-base leading-tight">
                          {trx.products?.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-100">
                            x{trx.quantity} Pcs
                          </span>
                          <span className="flex items-center gap-1">
                            <Store className="w-3 h-3" /> {trx.outlets?.name}
                          </span>
                        </div>
                      </div>
                      
                      {/* Harga Besar */}
                      <div className="text-right">
                         <span className="block font-bold text-green-600 text-base">
                          +Rp {trx.total_amount.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center justify-end gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(trx.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bagian Kanan: Tombol Hapus Aman */}
                  <div className="flex items-center border-l border-gray-100 pl-3">
                    <form action={deleteTransaction.bind(null, trx.id)}>
                      <button 
                        type="submit"
                        className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-red-100"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}