import { createClient } from '@/lib/supabase/server'
import { addIncome, deleteTransaction } from './actions'
import { Wallet, Store, Package, Calculator, Save, Trash2, History } from 'lucide-react'

export default async function TransactionPage() {
  const supabase = await createClient()

  // 1. Ambil Data Master (Untuk Pilihan Dropdown)
  const { data: products } = await supabase.from('products').select('*').order('name')
  const { data: outlets } = await supabase.from('outlets').select('*').order('name')

  // 2. Ambil Riwayat Transaksi (Terbaru diatas)
  const { data: transactions } = await supabase
    .from('income_transactions')
    .select(`
      id, quantity, total_amount, created_at,
      products (name, price),
      outlets (name)
    `)
    .order('created_at', { ascending: false })
    .limit(10) // Tampilkan 10 terakhir saja biar ringan

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded-md"><Wallet className="w-5 h-5" /></span>
            Input Penjualan
          </h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-8">
        
        {/* === FORM INPUT === */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-blue-50/50 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700 text-sm">Catat Transaksi Baru</h2>
          </div>
          
          <div className="p-6">
            <form action={addIncome} className="space-y-5">
              
              {/* Pilih Warung */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Lokasi Warung</label>
                <div className="relative">
                  <Store className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <select name="outlet_id" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none">
                    <option value="">-- Pilih Warung --</option>
                    {outlets?.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4">
                {/* Pilih Produk */}
                <div className="col-span-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Produk</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <select name="product_id" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none">
                      <option value="">-- Pilih --</option>
                      {products?.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Input Jumlah */}
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Jumlah</label>
                  <div className="relative">
                    <Calculator className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input name="quantity" type="number" min="1" placeholder="0" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition flex justify-center items-center gap-2">
                <Save className="w-4 h-4" /> Simpan Laporan
              </button>
            </form>
          </div>
        </div>

        {/* === RIWAYAT TRANSAKSI === */}
        <div>
          <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 px-1">
            <History className="w-4 h-4 text-gray-500" /> Riwayat Terakhir
          </h3>

          <div className="space-y-3">
            {transactions?.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">Belum ada transaksi hari ini.</p>
              </div>
            ) : (
              transactions?.map((trx: any) => (
                <div key={trx.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 text-blue-600 font-bold w-10 h-10 rounded-full flex items-center justify-center text-xs shrink-0">
                      x{trx.quantity}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{trx.products?.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Store className="w-3 h-3" /> {trx.outlets?.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-green-600 text-sm">+Rp {trx.total_amount.toLocaleString('id-ID')}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className="text-[10px] text-gray-400">{new Date(trx.created_at).toLocaleDateString('id-ID')}</span>
                      
                      {/* Tombol Hapus Kecil */}
                      <form action={deleteTransaction.bind(null, trx.id)}>
                        <button className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
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