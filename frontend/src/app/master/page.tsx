import { createClient } from '@/lib/supabase/server'
import { addProduct, addOutlet, deleteItem } from './actions'
import { Package, Store, Trash2, Plus, DollarSign, MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function MasterPage() {
  const supabase = await createClient()

  // Ambil data
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  const { data: outlets } = await supabase.from('outlets').select('*').order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      
      {/* === HEADER === */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Tombol Kembali */}
            <Link href="/" className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            
            <h1 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="bg-yellow-400 text-slate-900 p-1.5 rounded-lg shadow-lg shadow-yellow-400/20">
                <Package className="w-5 h-5" />
              </span>
              Master Data
            </h1>
          </div>
          
          <span className="text-xs font-bold px-3 py-1 bg-slate-800 rounded-full text-yellow-400 border border-slate-700 shadow-sm">
            Admin Mode
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* === SECTION 1: PRODUK === */}
          <div className="space-y-6">
            
            {/* Form Input Produk */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wide">
                  Produk Baru
                </h2>
              </div>
              
              <div className="p-6">
                <form action={addProduct} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nama Produk</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded-md group-focus-within:bg-blue-100 transition-colors">
                        <Package className="w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input 
                        name="name" 
                        type="text" 
                        placeholder="Contoh: Kemplang Bakar" 
                        required 
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Harga Satuan</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded-md group-focus-within:bg-blue-100 transition-colors">
                        <DollarSign className="w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input 
                        name="price" 
                        type="number" 
                        placeholder="0" 
                        required 
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-800 placeholder:text-slate-400 transition-all" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 text-sm mt-2">
                    <Plus className="w-5 h-5" /> Simpan Produk
                  </button>
                </form>
              </div>
            </div>

            {/* List Produk */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-5 flex justify-between items-center text-lg">
                Daftar Produk
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100 font-bold">{products?.length || 0} Item</span>
              </h3>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {products?.length === 0 ? (
                  <div className="text-center py-12 text-slate-300 border-2 border-dashed border-slate-100 rounded-xl">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">Belum ada produk.</p>
                  </div>
                ) : (
                  products?.map((product) => (
                    <div 
                      key={product.id} 
                      className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-blue-200 active:scale-[0.98] active:bg-slate-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0 border border-blue-100">
                          {product.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{product.name}</p>
                          <p className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-1">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                      
                      {/* Tombol Hapus */}
                      <form action={deleteItem.bind(null, product.id, 'products')}>
                        <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-slate-200 hover:border-red-500">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* === SECTION 2: WARUNG (OUTLET) === */}
          <div className="space-y-6">
            
            {/* Form Input Warung */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-green-50 border-b border-green-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <h2 className="text-sm font-bold text-green-800 uppercase tracking-wide">
                  Warung Baru
                </h2>
              </div>

              <div className="p-6">
                <form action={addOutlet} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nama Warung</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded-md group-focus-within:bg-green-100 transition-colors">
                        <Store className="w-4 h-4 text-slate-500 group-focus-within:text-green-600 transition-colors" />
                      </div>
                      <input 
                        name="name" 
                        type="text" 
                        placeholder="Contoh: Warung Bu Siti" 
                        required 
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95 text-sm mt-2">
                    <Plus className="w-5 h-5" /> Simpan Warung
                  </button>
                </form>
              </div>
            </div>

            {/* List Warung */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-5 flex justify-between items-center text-lg">
                Daftar Warung
                <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-lg border border-green-100 font-bold">{outlets?.length || 0} Lokasi</span>
              </h3>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {outlets?.length === 0 ? (
                  <div className="text-center py-12 text-slate-300 border-2 border-dashed border-slate-100 rounded-xl">
                    <MapPin className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">Belum ada warung.</p>
                  </div>
                ) : (
                  outlets?.map((outlet) => (
                    <div 
                      key={outlet.id} 
                      className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-green-200 active:scale-[0.98] active:bg-slate-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-bold text-lg shrink-0 border border-green-100">
                          {outlet.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{outlet.name}</span>
                      </div>
                      
                      {/* Tombol Hapus */}
                      <form action={deleteItem.bind(null, outlet.id, 'outlets')}>
                        <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-slate-200 hover:border-red-500">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}