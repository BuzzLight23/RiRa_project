import { createClient } from '@/lib/supabase/server'
import { addExpense, deleteExpense } from './actions'
import { Receipt, DollarSign, Plus, Trash2, History } from 'lucide-react'

export default async function ExpensePage() {
  const supabase = await createClient()

  // Ambil Riwayat Pengeluaran (Terbaru diatas)
  const { data: expenses } = await supabase
    .from('expense_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-red-600 text-white p-1 rounded-md"><Receipt className="w-5 h-5" /></span>
            Catat Pengeluaran
          </h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-8">
        
        {/* === FORM INPUT === */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-red-50/50 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700 text-sm">Pengeluaran Operasional</h2>
          </div>
          
          <div className="p-6">
            <form action={addExpense} className="space-y-5">
              
              {/* Deskripsi */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Keterangan</label>
                <div className="relative">
                  <Receipt className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input 
                    name="description" 
                    type="text" 
                    placeholder="Contoh: Beli Bensin, Plastik, Minyak Goreng..." 
                    required 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" 
                  />
                </div>
              </div>

              {/* Nominal */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Nominal (Rp)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input 
                    name="amount" 
                    type="number" 
                    min="1" 
                    placeholder="0" 
                    required 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" 
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/20 active:scale-95 transition flex justify-center items-center gap-2">
                <Plus className="w-4 h-4" /> Simpan Pengeluaran
              </button>
            </form>
          </div>
        </div>

        {/* === RIWAYAT PENGELUARAN === */}
        <div>
          <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 px-1">
            <History className="w-4 h-4 text-gray-500" /> Riwayat Terakhir
          </h3>

          <div className="space-y-3">
            {expenses?.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">Belum ada pengeluaran hari ini.</p>
              </div>
            ) : (
              expenses?.map((trx: any) => (
                <div key={trx.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 text-red-600 font-bold w-10 h-10 rounded-full flex items-center justify-center text-xs shrink-0">
                      Out
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{trx.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(trx.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-red-600 text-sm">-Rp {trx.amount.toLocaleString('id-ID')}</p>
                    
                    {/* Tombol Hapus Kecil */}
                    <form action={deleteExpense.bind(null, trx.id)} className="flex justify-end mt-1">
                      <button className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
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