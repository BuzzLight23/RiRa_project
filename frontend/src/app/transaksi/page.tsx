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
    <div className="min-h-screen bg-slate-50 pb-24">
      
      {/* HEADER */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          
          <h1 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="bg-yellow-400 text-slate-900 p-1.5 rounded-lg shadow-lg shadow-yellow-400/20">
              <Wallet className="w-5 h-5" />
            </span>
            Input Penjualan
          </h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
        
        {/* === FORM INPUT CARD === */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <h2 className="font-bold text-blue-800 text-sm uppercase tracking-wide">
              Form Penjualan
            </h2>
          </div>
          
          <div className="p-6">
            <form action={addIncome} className="space-y-6">
              
              {/* Field Warung */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Lokasi Warung</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded-md group-focus-within:bg-blue-100 transition-colors">
                    <Store className="w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <select name="outlet_id" required className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none font-medium text-slate-700 transition-all">
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Produk</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded-md group-focus-within:bg-blue-100 transition-colors">
                      <Package className="w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <select name="product_id" required className="w-full pl-12 pr-8 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none font-medium text-slate-700 transition-all">
                      <option value="">Pilih...</option>
                      {products?.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field Jumlah */}
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Jml</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded-md group-focus-within:bg-blue-100 transition-colors">
                      <Calculator className="w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input 
                      name="quantity" 
                      type="number" 
                      min="1" 
                      placeholder="0" 
                      required 
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-800 transition-all" 
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition flex justify-center items-center gap-2 text-sm mt-2">
                <Save className="w-5 h-5" /> Simpan Laporan
              </button>
            </form>
          </div>
        </div>

        {/* === DAFTAR RIWAYAT === */}
        <div>
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-5 px-1 text-lg">
            <History className="w-5 h-5 text-slate-400" /> Riwayat Terakhir
          </h3>

          <div className="flex flex-col gap-3">
            {transactions?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <Package className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                <p className="text-slate-400 font-medium text-sm">Belum ada transaksi hari ini.</p>
              </div>
            ) : (
              transactions?.map((trx: any) => (
                <div 
                  key={trx.id} 
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex items-stretch gap-4 group hover:border-blue-200 active:scale-[0.98] active:bg-slate-50 transition-all duration-200"
                >
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-bold text-slate-800 text-base leading-tight">
                          {trx.products?.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-100">
                            x{trx.quantity} Pcs
                          </span>
                          <span className="flex items-center gap-1">
                            <Store className="w-3 h-3" /> {trx.outlets?.name}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                         <span className="block font-bold text-green-600 text-base">
                          +Rp {trx.total_amount.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(trx.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center border-l border-slate-100 pl-3">
                    <form action={deleteTransaction.bind(null, trx.id)}>
                      <button 
                        type="submit"
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-slate-200 hover:border-red-500"
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