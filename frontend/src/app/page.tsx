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
    <div className="min-h-screen bg-gray-50 pb-20 print:bg-white">
      
      {/* HEADER & FILTER */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1.5 rounded-lg"><TrendingUp className="w-6 h-6" /></span>
              Dashboard Keuangan RiRa
            </h1>
            
            {/* Tombol Navigasi Cepat */}
            <div className="flex gap-2">
              {/* Master Data */}
              <Link href="/master" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm">
                <Database className="w-4 h-4" /> Master Data
              </Link>
              
              <Link href="/transaksi" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm">
                Input Jual
              </Link>
              
              <Link href="/pengeluaran" className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-sm">
                Input Keluar
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Tab Filter Periode*/}
            <div className="flex gap-2 overflow-x-auto overflow-y-hidden w-full md:w-auto p-1">
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
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    period === tab.val 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>

            {/* Tombol Download */}
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

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 print:p-0">
        
        {/* === RINGKASAN KARTU (STATISTIK) === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
          {/* Card Pemasukan */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:border-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg text-green-600"><Wallet className="w-5 h-5" /></div>
              <p className="text-sm font-medium text-gray-500">Total Pemasukan</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{toRupiah(totalIncome)}</p>
          </div>

          {/* Card Pengeluaran */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:border-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 rounded-lg text-red-600"><TrendingDown className="w-5 h-5" /></div>
              <p className="text-sm font-medium text-gray-500">Total Pengeluaran</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{toRupiah(totalExpense)}</p>
          </div>

          {/* Card Keuntungan Bersih */}
          <div className={`bg-white p-6 rounded-2xl border shadow-sm print:border-2 ${netProfit >= 0 ? 'border-blue-100 bg-blue-50/30' : 'border-orange-100 bg-orange-50/30'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${netProfit >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gray-500">Keuntungan Bersih</p>
            </div>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-700' : 'text-orange-600'}`}>
              {toRupiah(netProfit)}
            </p>
          </div>
        </div>

        {/* === DETAIL LAPORAN === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1">
          
          {/* 1. Laporan Masuk */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[500px] print:h-auto print:border-2">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" /> Rincian Penjualan
              </h2>
              <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full print:hidden">
                {incomeData?.length || 0} Transaksi
              </span>
            </div>
            <div className="overflow-y-auto flex-1 p-2 print:overflow-visible">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 print:static">
                  <tr>
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3 text-center">Warung</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {incomeData?.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-8 text-gray-400">Tidak ada penjualan.</td></tr>
                  ) : (
                    incomeData?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800 flex items-center gap-2">
                            <Package className="w-3 h-3 text-gray-400" /> {item.products?.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 ml-5">Qty: {item.quantity}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600 print:bg-transparent print:border">
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

          {/* 2. Laporan Keluar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[500px] print:h-auto print:border-2">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" /> Rincian Pengeluaran
              </h2>
              <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full print:hidden">
                {expenseData?.length || 0} Transaksi
              </span>
            </div>
            <div className="overflow-y-auto flex-1 p-2 print:overflow-visible">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 print:static">
                  <tr>
                    <th className="px-4 py-3">Keterangan</th>
                    <th className="px-4 py-3 text-right">Tanggal</th>
                    <th className="px-4 py-3 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenseData?.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-8 text-gray-400">Tidak ada pengeluaran.</td></tr>
                  ) : (
                    expenseData?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-gray-500">
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