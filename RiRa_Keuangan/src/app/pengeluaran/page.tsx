import { createClient } from '@/lib/supabase/server'
import { addExpense, deleteExpense } from './actions'
import { Receipt, DollarSign, Plus, Trash2, History, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ExpensePage() {
  const supabase = await createClient()

  // Ambil Riwayat Pengeluaran
  const { data: expenses } = await supabase
    .from('expense_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      
      {/* === HEADER === */}
      <div className="bg-slate-900 text-white shadow-md sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg text-slate-900 shadow-yellow-400/20">
              <Receipt className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-wide">Catat Pengeluaran</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* KOLOM KIRI: FORM INPUT */}
          <section className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md">
              {/* Card Header: Red Accent */}
              <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                <h2 className="text-red-700 font-bold text-sm tracking-wider uppercase">
                  Form Pengeluaran
                </h2>
              </div>
              
              <div className="p-6">
                <form action={addExpense} className="space-y-6">
                  
                  {/* Field Deskripsi */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Keterangan</label>
                    <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <input 
                        name="description" 
                        type="text" 
                        placeholder="Contoh: Beli Bensin, Plastik..." 
                        required 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder-slate-400 text-sm font-medium text-slate-800 hover:bg-white hover:border-red-300" 
                      />
                    </div>
                  </div>

                  {/* Field Nominal */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nominal (Rp)</label>
                    <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <input 
                        name="amount" 
                        type="number" 
                        min="1" 
                        placeholder="0" 
                        required 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder-slate-400 text-sm font-bold text-slate-800 hover:bg-white hover:border-red-300" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/20 transform hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Simpan Pengeluaran
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
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                10 Data
              </span>
            </div>

            <div className="p-4 space-y-3 max-h-150 overflow-y-auto custom-scrollbar">
              {expenses?.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-400 font-medium text-sm">Belum ada pengeluaran.</p>
                </div>
              ) : (
                expenses?.map((trx: any) => (
                  <div key={trx.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:border-red-200 transition-all duration-200 group flex flex-col sm:flex-row sm:items-center justify-between gap-3 active:scale-[0.99]">
                    
                    {/* Info Kiri */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100 shrink-0">
                          KELUAR
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm truncate">{trx.description}</h4>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-xs ml-1 font-medium">
                         <Calendar className="w-3 h-3" />
                         {new Date(trx.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                         })}
                      </div>
                    </div>
                    
                    {/* Info Kanan & Hapus */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-50 pt-2 sm:pt-0">
                      <div className="text-right">
                         <span className="block font-bold text-red-600 text-sm font-mono">
                          -Rp {trx.amount.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <form action={deleteExpense.bind(null, trx.id)}>
                        <button 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
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