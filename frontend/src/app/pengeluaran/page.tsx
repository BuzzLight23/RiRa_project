import { createClient } from '@/lib/supabase/server'
import { addExpense, deleteExpense } from './actions'
import { Receipt, DollarSign, Plus, Trash2, History, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ExpensePage() {
  const supabase = await createClient()

  // Ambil Riwayat Pengeluaran (Limit 20)
  const { data: expenses } = await supabase
    .from('expense_transactions')
    .select('*')
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
              <Receipt className="w-5 h-5" />
            </span>
            Catat Pengeluaran
          </h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
        
        {/* === FORM INPUT CARD === */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <h2 className="font-bold text-red-800 text-sm uppercase tracking-wide">
              Form Pengeluaran
            </h2>
          </div>
          
          <div className="p-6">
            <form action={addExpense} className="space-y-6">
              
              {/* Field Deskripsi */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Keterangan</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded-md group-focus-within:bg-red-100 transition-colors">
                    <Receipt className="w-4 h-4 text-slate-500 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input 
                    name="description" 
                    type="text" 
                    placeholder="Contoh: Beli Bensin, Plastik..." 
                    required 
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all" 
                  />
                </div>
              </div>

              {/* Field Nominal */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Nominal (Rp)</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded-md group-focus-within:bg-red-100 transition-colors">
                    <DollarSign className="w-4 h-4 text-slate-500 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input 
                    name="amount" 
                    type="number" 
                    min="1" 
                    placeholder="0" 
                    required 
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-bold text-slate-800 placeholder:text-slate-400 transition-all" 
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/20 active:scale-95 transition flex justify-center items-center gap-2 text-sm mt-2">
                <Plus className="w-5 h-5" /> Simpan Pengeluaran
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
            {expenses?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <Receipt className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                <p className="text-slate-400 font-medium text-sm">Belum ada pengeluaran.</p>
              </div>
            ) : (
              expenses?.map((trx: any) => (
                <div 
                  key={trx.id} 
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex items-stretch gap-4 group hover:border-red-200 active:scale-[0.98] active:bg-slate-50 transition-all duration-200"
                >
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-bold text-slate-800 text-base leading-tight">
                          {trx.description}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
                          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[11px] font-bold border border-red-100">
                            KELUAR
                          </span>
                          <span className="flex items-center gap-1">
                             <Calendar className="w-3 h-3" />
                             {new Date(trx.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                             })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                         <span className="block font-bold text-red-600 text-base">
                          -Rp {trx.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center border-l border-slate-100 pl-3">
                    <form action={deleteExpense.bind(null, trx.id)}>
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