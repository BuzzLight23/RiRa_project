import { createClient } from '@/lib/supabase/server'
import { addProduct, addOutlet, deleteItem } from './actions'
import { Package, Store, Trash2, Plus, DollarSign, MapPin } from 'lucide-react'

export default async function MasterPage() {
  const supabase = await createClient()

  // Ambil data
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  const { data: outlets } = await supabase.from('outlets').select('*').order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* === HEADER === */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded">RiRa</span> Master Data
          </h1>
          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-500">
            Admin Mode
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* === SECTION 1: PRODUK (KERUPUK) === */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-blue-50/50">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Produk Baru
                </h2>
                <p className="text-sm text-gray-500 mt-1">Input varian kerupuk & kemplang di sini.</p>
              </div>
              
              <div className="p-6">
                <form action={addProduct} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nama Produk</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input 
                        name="name" 
                        type="text" 
                        placeholder="Contoh: Kemplang Bakar" 
                        required 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm text-gray-800 placeholder:text-gray-400" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Harga Satuan</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input 
                        name="price" 
                        type="number" 
                        placeholder="0" 
                        required 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm text-gray-800 placeholder:text-gray-400" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
                    <Plus className="w-4 h-4" /> Simpan Produk
                  </button>
                </form>
              </div>
            </div>

            {/* List Produk */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
                Daftar Produk
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{products?.length || 0} Item</span>
              </h3>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {products?.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada produk.</p>
                  </div>
                ) : (
                  products?.map((product) => (
                    <div key={product.id} className="group flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                          {product.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">Rp {product.price.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                      <form action={deleteItem.bind(null, product.id, 'products')}>
                        <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-green-50/50">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Store className="w-5 h-5 text-green-600" />
                  Warung Baru
                </h2>
                <p className="text-sm text-gray-500 mt-1">Daftarkan warung penitipan barang.</p>
              </div>

              <div className="p-6">
                <form action={addOutlet} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nama Warung</label>
                    <div className="relative">
                      <Store className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input 
                        name="name" 
                        type="text" 
                        placeholder="Contoh: Warung Bu Siti" 
                        required 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition text-sm text-gray-800 placeholder:text-gray-400" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95">
                    <Plus className="w-4 h-4" /> Simpan Warung
                  </button>
                </form>
              </div>
            </div>

            {/* List Warung */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
                Daftar Warung
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{outlets?.length || 0} Lokasi</span>
              </h3>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {outlets?.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada warung.</p>
                  </div>
                ) : (
                  outlets?.map((outlet) => (
                    <div key={outlet.id} className="group flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm shrink-0">
                          {outlet.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">{outlet.name}</span>
                      </div>
                      <form action={deleteItem.bind(null, outlet.id, 'outlets')}>
                        <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
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