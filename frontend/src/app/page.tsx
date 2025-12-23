import { createClient } from '@/lib/supabase/server'
import { getDateRange, Period } from '@/lib/dateRange'
import Link from 'next/link'
import { Wallet, TrendingUp, TrendingDown, DollarSign, Package, Store, Database } from 'lucide-react'
import DownloadReport from '@/components/DownloadReport'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  
  // 1. Tangkap Filter dari URL (Default: 'daily')
  const params = await searchParams
  const period = (params.periode as Period) || 'daily'
  const { start, end } = getDateRange(period)

  // 2. Query Pemasukan (Income)
  let incomeQuery = supabase
    .from('income_transactions')
    .select(`
      id, created_at, quantity, total_amount,
      products (name),
      outlets (name)
    `)
    .order('created_at', { ascending: false })

  // 3. Query Pengeluaran (Expense)
  let expenseQuery = supabase
    .from('expense_transactions')
    .select('*')
    .order('created_at', { ascending: false })

  // Terapkan Filter Tanggal jika bukan 'all'
  if (start && end) {
    incomeQuery = incomeQuery.gte('created_at', start).lte('created_at', end)
    expenseQuery = expenseQuery.gte('created_at', start).lte('created_at', end)
  }

  const { data: incomeData } = await incomeQuery
  const { data: expenseData } = await expenseQuery

  // 4. Hitung Ringkasan (Kalkulator)
  const totalIncome = incomeData?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0
  const totalExpense = expenseData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0
  const netProfit = totalIncome - totalExpense

  // Format Rupiah
  const toRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)

  return (
    <div className="min-h-screen bg-slate-50 pb-20 print:bg-white">
      
      {/* HEADER */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 shadow-md print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-5">
          
          {/* Baris Atas: Logo & Navigasi */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-yellow-400 text-slate-900 p-1.5 rounded-lg shadow-lg shadow-yellow-400/20">
                <TrendingUp className="w-6 h-6" />
              </span>
              Dashboard RiRa
            </h1>
            
            <div className="flex gap-2">
              {/* Tombol Master Data */}
              <Link href="/master" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-yellow-400 border border-slate-700 hover:bg-slate-800 hover:border-yellow-400 rounded-lg transition active:scale-95">
                <Database className="w-4 h-4" /> Master Data
              </Link>
              
              <Link href="/transaksi" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition shadow-sm border border-transparent active:scale-95">
                Input Jual
              </Link>
              
              <Link href="/pengeluaran" className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition shadow-sm border border-transparent active:scale-95">
                Input Keluar
              </Link>
            </div>
          </div>

          {/* Baris Bawah: Filter & Download */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Tab Filter */}
            <div className="flex gap-2 overflow-x-auto overflow-y-hidden w-full md:w-auto p-1 bg-slate-800/50 rounded-xl border border-slate-700">
              {[
                { label: 'Hari Ini', val: 'daily' },
                { label: 'Minggu Ini', val: 'weekly' },
                { label: 'Bulan Ini', val: 'monthly' },
                { label: 'Tahun Ini', val: 'yearly' },
                { label: 'Semua', val: 'all' },
              ].map((tab) => (
                <Link
                  key={tab.val}
                  href={`/?periode=${tab.val}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
                    period === tab.val 
                      ? 'bg-yellow-400 text-slate-900 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700' 
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>

            <div className="shrink-0">
              <DownloadReport 
                incomeData={incomeData || []} 
                expenseData={expenseData || []} 
                period={period} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 print:p-0">
        
        {/* STATISTIK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
          {/* Card Pemasukan */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:border-2 active:scale-[0.98] transition-transform duration-150">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-700"><Wallet className="w-5 h-5" /></div>
              <p className="text-sm font-medium text-slate-500">Total Pemasukan</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{toRupiah(totalIncome)}</p>
          </div>

          {/* Card Pengeluaran */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:border-2 active:scale-[0.98] transition-transform duration-150">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg text-red-700"><TrendingDown className="w-5 h-5" /></div>
              <p className="text-sm font-medium text-slate-500">Total Pengeluaran</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{toRupiah(totalExpense)}</p>
          </div>

          {/* Card Keuntungan */}
          <div className={`bg-white p-6 rounded-2xl border shadow-sm print:border-2 active:scale-[0.98] transition-transform duration-150 ${netProfit >= 0 ? 'border-blue-200 bg-blue-50/50' : 'border-orange-200 bg-orange-50/50'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${netProfit >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-500">Keuntungan Bersih</p>
            </div>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
              {toRupiah(netProfit)}
            </p>
          </div>
        </div>

        {/* DETAIL TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1">
          
          {/* Tabel Penjualan */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px] print:h-auto print:border-2">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" /> Rincian Penjualan
              </h2>
              <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full print:hidden">
                {incomeData?.length || 0} Transaksi
              </span>
            </div>
            <div className="overflow-y-auto flex-1 p-2 print:overflow-visible">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 print:static">
                  <tr>
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3 text-center">Warung</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {incomeData?.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-8 text-slate-400">Tidak ada penjualan.</td></tr>
                  ) : (
                    incomeData?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50 active:bg-slate-100 active:scale-[0.99] transition-all duration-100">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800 flex items-center gap-2">
                            <Package className="w-3 h-3 text-slate-400" /> {item.products?.name}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 ml-5">Qty: {item.quantity}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-xs text-slate-600 print:bg-transparent print:border">
                            <Store className="w-3 h-3" /> {item.outlets?.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-green-600">
                          {toRupiah(item.total_amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabel Pengeluaran */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px] print:h-auto print:border-2">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-600" /> Rincian Pengeluaran
              </h2>
              <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full print:hidden">
                {expenseData?.length || 0} Transaksi
              </span>
            </div>
            <div className="overflow-y-auto flex-1 p-2 print:overflow-visible">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 print:static">
                  <tr>
                    <th className="px-4 py-3">Keterangan</th>
                    <th className="px-4 py-3 text-right">Tanggal</th>
                    <th className="px-4 py-3 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenseData?.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-8 text-slate-400">Tidak ada pengeluaran.</td></tr>
                  ) : (
                    expenseData?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50 active:bg-slate-100 active:scale-[0.99] transition-all duration-100">
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-slate-500">
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-red-600">
                          {toRupiah(item.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}