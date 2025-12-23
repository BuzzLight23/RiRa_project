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
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* === HEADER === */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Tombol Kembali */}
            <Link href="/" className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
                <Package className="w-5 h-5" />
              </span>
              Master Data
            </h1>
          </div>
          
          <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-500 border border-gray-200">
            Admin Mode
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* === SECTION 1: PRODUK (KERUPUK) === */}
          <div className="space-y-6">
            
            {/* Form Input Produk */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-blue-50/50 border-b border-blue-100">
                <h2 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Produk Baru
                </h2>
              </div>
              
              <div className="p-5">
                <form action={addProduct} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nama Produk</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-100 p-1.5 rounded-md">
                        <Package className="w-4 h-4 text-gray-500" />
                      </div>
                      <input 
                        name="name" 
                        type="text" 
                        placeholder="Contoh: Kemplang Bakar" 
                        required 
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-700" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Harga Satuan</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-100 p-1.5 rounded-md">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                      </div>
                      <input 
                        name="price" 
                        type="number" 
                        placeholder="0" 
                        required 
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-gray-800" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 text-sm">
                    <Plus className="w-5 h-5" /> Simpan Produk
                  </button>
                </form>
              </div>
            </div>

            {/* List Produk */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-5 flex justify-between items-center text-lg">
                Daftar Produk
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100 font-bold">{products?.length || 0} Item</span>
              </h3>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {products?.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">Belum ada produk.</p>
                  </div>
                ) : (
                  products?.map((product) => (
                    <div key={product.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-blue-200 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0 border border-blue-100">
                          {product.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{product.name}</p>
                          <p className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md inline-block mt-1">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                      
                      {/* Tombol Hapus Aman */}
                      <form action={deleteItem.bind(null, product.id, 'products')}>
                        <button className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-gray-200 hover:border-red-500">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-green-50/50 border-b border-green-100">
                <h2 className="text-sm font-bold text-green-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Warung Baru
                </h2>
              </div>

              <div className="p-5">
                <form action={addOutlet} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nama Warung</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-100 p-1.5 rounded-md">
                        <Store className="w-4 h-4 text-gray-500" />
                      </div>
                      <input 
                        name="name" 
                        type="text" 
                        placeholder="Contoh: Warung Bu Siti" 
                        required 
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium text-gray-700" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95 text-sm">
                    <Plus className="w-5 h-5" /> Simpan Warung
                  </button>
                </form>
              </div>
            </div>

            {/* List Warung */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-5 flex justify-between items-center text-lg">
                Daftar Warung
                <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-lg border border-green-100 font-bold">{outlets?.length || 0} Lokasi</span>
              </h3>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {outlets?.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                    <MapPin className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">Belum ada warung.</p>
                  </div>
                ) : (
                  outlets?.map((outlet) => (
                    <div key={outlet.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-green-200 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-bold text-lg shrink-0 border border-green-100">
                          {outlet.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-800 text-sm">{outlet.name}</span>
                      </div>
                      
                      {/* Tombol Hapus Aman */}
                      <form action={deleteItem.bind(null, outlet.id, 'outlets')}>
                        <button className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-gray-200 hover:border-red-500">
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