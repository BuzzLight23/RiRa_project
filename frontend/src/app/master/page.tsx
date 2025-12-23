import { createClient } from '@/lib/supabase/server'
import { addProduct, addOutlet, deleteItem } from './actions'
import { Package, Store, Trash2, Plus, DollarSign, MapPin, ArrowLeft, Archive, Search } from 'lucide-react'
import Link from 'next/link'

export default async function MasterPage() {
  const supabase = await createClient()

  // Ambil data dari Supabase
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  const { data: outlets } = await supabase.from('outlets').select('*').order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      
      {/* === HEADER (Navy Theme) === */}
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Tombol Kembali */}
              <Link href="/" className="text-slate-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-slate-800">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500 p-1.5 rounded-lg flex items-center justify-center text-slate-900 shadow-sm shadow-yellow-500/20">
                  <Archive className="w-5 h-5" />
                </div>
                <h1 className="font-bold text-xl tracking-tight">Master Data</h1>
              </div>
            </div>
            <div>
              <span className="px-3 py-1 text-xs font-bold bg-slate-800 text-yellow-400 border border-slate-700 rounded-full shadow-inner">
                Admin Mode
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* === KOLOM 1: PRODUK (Blue Theme) === */}
          <div className="space-y-6">
            
            {/* Form Produk */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className="bg-blue-50/50 px-6 py-4 border-b border-blue-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wide">Produk Baru</h2>
              </div>
              
              <div className="p-6">
                <form action={addProduct} className="space-y-5">
                  {/* Input Nama */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Produk</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Package className="w-5 h-5" />
                      </div>
                      <input 
                        name="name" 
                        type="text" 
                        placeholder="Contoh: Kemplang Bakar" 
                        required
                        className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none" 
                      />
                    </div>
                  </div>

                  {/* Input Harga */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Harga Satuan</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <input 
                        name="price" 
                        type="number" 
                        placeholder="0" 
                        required
                        className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-bold text-slate-800 placeholder-slate-400 transition-all outline-none" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                    <Plus className="w-5 h-5" />
                    Simpan Produk
                  </button>
                </form>
              </div>
            </section>

            {/* List Produk */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">Daftar Produk</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
                  {products?.length || 0} Item
                </span>
              </div>
              
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {products?.length === 0 ? (
                  <div className="text-center py-10">
                    <Package className="w-12 h-12 mx-auto text-slate-200 mb-2" />
                    <p className="text-slate-400 text-sm">Belum ada data produk.</p>
                  </div>
                ) : (
                  products?.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-300 transition-all group active:scale-[0.99] duration-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100 shrink-0">
                          {product.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{product.name}</h3>
                          <p className="text-xs text-slate-500 mt-1 font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded border border-slate-200">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                      
                      <form action={deleteItem.bind(null, product.id, 'products')}>
                        <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* === KOLOM 2: WARUNG (Green Theme) === */}
          <div className="space-y-6">
            
            {/* Form Warung */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className="bg-green-50/50 px-6 py-4 border-b border-green-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <h2 className="text-sm font-bold text-green-700 uppercase tracking-wide">Warung Baru</h2>
              </div>
              
              <div className="p-6">
                <form action={addOutlet} className="space-y-5">
                  {/* Input Nama Warung */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Warung</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-500 transition-colors">
                        <Store className="w-5 h-5" />
                      </div>
                      <input 
                        name="name" 
                        type="text" 
                        placeholder="Contoh: Warung Bu Siti" 
                        required
                        className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none" 
                      />
                    </div>
                  </div>

                  {/* Input Alamat (BARU) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Lokasi</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-500 transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <input 
                        name="address" 
                        type="text" 
                        placeholder="Contoh: Jl. Mawar No. 5 (Opsional)" 
                        className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                    <Plus className="w-5 h-5" />
                    Simpan Warung
                  </button>
                </form>
              </div>
            </section>

            {/* List Warung */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">Daftar Warung</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                  {outlets?.length || 0} Lokasi
                </span>
              </div>
              
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {outlets?.length === 0 ? (
                  <div className="text-center py-10">
                    <Store className="w-12 h-12 mx-auto text-slate-200 mb-2" />
                    <p className="text-slate-400 text-sm">Belum ada data warung.</p>
                  </div>
                ) : (
                  outlets?.map((outlet) => (
                    <div key={outlet.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 hover:border-green-300 transition-all group active:scale-[0.99] duration-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-lg border border-green-100 shrink-0">
                          {outlet.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{outlet.name}</h3>
                          {/* Tampilkan Alamat jika ada */}
                          {outlet.address ? (
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {outlet.address}
                            </p>
                          ) : (
                            <p className="text-xs text-slate-300 mt-1 italic">Tidak ada alamat</p>
                          )}
                        </div>
                      </div>
                      
                      <form action={deleteItem.bind(null, outlet.id, 'outlets')}>
                        <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  )
}