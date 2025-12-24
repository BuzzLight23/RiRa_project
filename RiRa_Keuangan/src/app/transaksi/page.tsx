import { createClient } from '@/lib/supabase/server'
import { addIncome, deleteTransaction } from './actions'
import { Wallet, Store, Package, Calculator, Save, Trash2, History, ArrowLeft, Search, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default async function TransactionPage() {
  const supabase = await createClient()

  const { data: products } = await supabase.from('products').select('*').order('name')
  const { data: outlets } = await supabase.from('outlets').select('*').order('name')

  const { data: transactions } = await supabase
    .from('income_transactions')
    .select(`
      id, quantity, total_amount, created_at,
      products (name, price),
      outlets (name)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="bg-slate-900 text-white shadow-md sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white active:scale-90 duration-200">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg text-slate-900 shadow-yellow-400/20">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-wide">Input Penjualan</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* KOLOM KIRI: FORM INPUT */}
          <section className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-blue-50/50 px-6 py-4 border-b border-blue-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <h2 className="text-blue-700 font-bold text-sm tracking-wider uppercase">Form Penjualan</h2>
              </div>
              
              <div className="p-6">
                <form action={addIncome} className="space-y-6">
                  
                  {/* Field Lokasi Warung */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 transition-colors group-focus-within:text-blue-600">
                      Lokasi Warung
                    </label>
                    <div className="relative">
                      {/* Animasi Ikon: Scale & Color saat fokus */}
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-all duration-300 group-focus-within:text-blue-600 group-focus-within:scale-110">
                        <Store className="w-5 h-5" />
                      </div>
                      <select 
                        name="outlet_id" 
                        required 
                        className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 text-sm font-medium text-slate-800 cursor-pointer appearance-none"
                      >
                        <option value="">Pilih Warung...</option>
                        {outlets?.map(o => (
                          <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Field Produk */}
                    <div className="md:col-span-2 space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 transition-colors group-focus-within:text-blue-600">
                        Produk
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-all duration-300 group-focus-within:text-blue-600 group-focus-within:scale-110">
                          <Package className="w-5 h-5" />
                        </div>
                        <select 
                          name="product_id" 
                          required 
                          className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 text-sm font-medium text-slate-800 cursor-pointer appearance-none"
                        >
                          <option value="">Pilih Produk...</option>
                          {products?.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                          <Search className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Field Jumlah */}
                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 transition-colors group-focus-within:text-blue-600">
                        Jumlah
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-all duration-300 group-focus-within:text-blue-600 group-focus-within:scale-110">
                          <Calculator className="w-5 h-5" />
                        </div>
                        <input 
                          name="quantity" 
                          type="number" 
                          min="1" 
                          placeholder="0" 
                          required 
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 placeholder-slate-400 text-sm font-bold text-slate-800 text-right"
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 transform active:scale-[0.96] transition-all duration-200 flex items-center justify-center gap-2 group">
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Simpan Laporan
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* KOLOM KANAN: RIWAYAT */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <History className="w-5 h-5 text-slate-400" />
                Riwayat Terakhir
              </h2>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                10 Data
              </span>
            </div>

            <div className="p-4 space-y-3 max-h-150 overflow-y-auto custom-scrollbar">
              {transactions?.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-400 font-medium">Belum ada transaksi hari ini.</p>
                </div>
              ) : (
                transactions?.map((trx: any) => (
                  <div key={trx.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:border-blue-300 transition-all duration-200 group flex flex-col sm:flex-row sm:items-center justify-between gap-3 active:scale-[0.98]">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
                          x{trx.quantity}
                        </span>
                        <h3 className="font-bold text-slate-800 text-sm">{trx.products?.name}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium ml-1">
                        <Store className="w-3 h-3 opacity-70" />
                        <span>{trx.outlets?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-50 pt-2 sm:pt-0">
                      <div className="text-right">
                        <div className="text-emerald-600 font-bold text-sm font-mono">
                          +Rp {trx.total_amount.toLocaleString('id-ID')}
                        </div>
                        <div className="text-slate-400 text-[10px] flex items-center justify-end gap-1 font-medium">
                          {new Date(trx.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short'
                          })}
                        </div>
                      </div>

                      <form action={deleteTransaction.bind(null, trx.id)}>
                        <button 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>

                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}