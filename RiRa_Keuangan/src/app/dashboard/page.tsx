import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getDateRange, Period } from '@/lib/dateRange'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Database, 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Store, 
  ShoppingBag, 
  Calendar 
} from 'lucide-react'
import DownloadReport from '@/components/DownloadReport'
import DateFilter from '@/components/DateFilter'
import UserNav from '@/components/UserNav'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 2. LOGIKA PERIODE & TANGGAL
  const params = await searchParams
  const period = (params.dashboardperiode as Period) || 'daily'
  const specificDate = params.date as string | undefined

  let start, end;

  if (specificDate) {
    const targetDate = new Date(specificDate);
    start = new Date(targetDate.setHours(0, 0, 0, 0)).toISOString();
    end = new Date(targetDate.setHours(23, 59, 59, 999)).toISOString();
  } else {
    const range = getDateRange(period);
    start = range.start;
    end = range.end;
  }

  // 3. QUERY DATABASE
  let incomeQuery = supabase.from('income_transactions').select(`id, created_at, quantity, total_amount, products (name), outlets (name)`).order('created_at', { ascending: false })
  let expenseQuery = supabase.from('expense_transactions').select('*').order('created_at', { ascending: false })

  if (start && end) {
    incomeQuery = incomeQuery.gte('created_at', start).lte('created_at', end)
    expenseQuery = expenseQuery.gte('created_at', start).lte('created_at', end)
  }

  const { data: incomeData } = await incomeQuery
  const { data: expenseData } = await expenseQuery

  const totalIncome = incomeData?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0
  const totalExpense = expenseData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0
  const netProfit = totalIncome - totalExpense

  const toRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)

  return (
    <div className="min-h-screen bg-slate-50 pb-20 print:bg-white flex flex-col font-sans text-slate-800">
      
      {/* HEADER UTAMA */}
      <header className="bg-slate-900 text-white px-6 py-4 shadow-md z-20 print:hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Judul */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-slate-900 shadow-lg shadow-yellow-400/20">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Dashboard RiRa</h1>
          </div>

          {/* Menu Navigasi & Profil */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            
            <Link href="/master" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 transition-colors text-sm font-medium active:scale-95">
              <Database className="w-4 h-4" />
              <span>Master Data</span>
            </Link>
            
            <Link href="/transaksi" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg shadow-blue-600/20 text-sm font-medium active:scale-95 border border-transparent">
              <Wallet className="w-4 h-4" />
              <span>Input Jual</span>
            </Link>
            
            <Link href="/pengeluaran" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg shadow-red-600/20 text-sm font-medium active:scale-95 border border-transparent">
              <TrendingDown className="w-4 h-4" />
              <span>Input Keluar</span>
            </Link>
            <div className="h-8 w-px bg-slate-700 mx-1 hidden sm:block"></div>
            <UserNav user={user} />

          </div>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-10 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="mr-2">
              <DateFilter />
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg p-1 overflow-x-auto no-scrollbar border border-slate-200">
              {[{ label: 'Hari Ini', val: 'daily' }, { label: 'Minggu Ini', val: 'weekly' }, { label: 'Bulan Ini', val: 'monthly' }, { label: 'Semua', val: 'all' }].map((tab) => (
                <Link key={tab.val} href={`/?dashboardperiode=${tab.val}`} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap active:scale-95 ${!specificDate && period === tab.val ? 'bg-yellow-400 text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:bg-white hover:text-slate-800'}`}>
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="shrink-0">
            <DownloadReport incomeData={incomeData || []} expenseData={expenseData || []} period={period} />
          </div>
        </div>
      </div>

      {/* CONTENT UTAMA */}
      <main className="grow px-6 py-8 print:p-0">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {specificDate && (
             <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center gap-2 text-blue-700 text-sm font-medium w-fit">
                <Calendar className="w-4 h-4" />
                Menampilkan data tanggal: <span className="font-bold">{new Date(specificDate).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
             </div>
          )}

          {/* KARTU RINGKASAN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3">
            
            {/* Card Pemasukan */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200 flex flex-col justify-between hover:shadow-md transition-all active:scale-[0.99] print:border-2">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600"><Wallet className="w-6 h-6" /></div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Income</span>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total Pemasukan</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{toRupiah(totalIncome)}</h3>
              </div>
            </div>

            {/* Card Pengeluaran */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-rose-200 flex flex-col justify-between hover:shadow-md transition-all active:scale-[0.99] print:border-2">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-rose-50 text-rose-600"><TrendingDown className="w-6 h-6" /></div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-rose-100 text-rose-700">Expense</span>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total Pengeluaran</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{toRupiah(totalExpense)}</h3>
              </div>
            </div>

            {/* Card Keuntungan */}
            <div className={`bg-white rounded-xl p-6 shadow-sm border flex flex-col justify-between hover:shadow-md transition-all active:scale-[0.99] print:border-2 ${netProfit >= 0 ? 'border-blue-200' : 'border-orange-200'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${netProfit >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}><DollarSign className="w-6 h-6" /></div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${netProfit >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>Net Profit</span>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Keuntungan Bersih</p>
                <h3 className={`text-3xl font-bold tracking-tight ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{toRupiah(netProfit)}</h3>
              </div>
            </div>
          </div>

          {/* TABLES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-125 print:h-auto print:border-2">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                  <h2 className="font-bold text-slate-900 text-lg">Rincian Penjualan</h2>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md print:hidden">{incomeData?.length || 0} Transaksi</span>
              </div>
              <div className="overflow-y-auto p-2 flex-1 print:overflow-visible custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white z-10 print:static">
                    <tr className="text-xs uppercase tracking-wider text-slate-500 bg-slate-50 rounded-lg">
                      <th className="px-4 py-3 font-semibold rounded-l-lg">Produk</th>
                      <th className="px-4 py-3 font-semibold text-center">Tanggal</th>
                      <th className="px-4 py-3 font-semibold text-center">Warung</th>
                      <th className="px-4 py-3 font-semibold text-right rounded-r-lg">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {incomeData?.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-10 text-slate-400">Belum ada data penjualan.</td></tr>
                    ) : (
                      incomeData?.map((item: any) => (
                        <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Package className="w-4 h-4" /></div>
                              <div><p className="font-semibold text-slate-900">{item.products?.name}</p><p className="text-xs text-slate-500">Qty: {item.quantity}</p></div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center text-slate-500 text-xs">
                            <div className="flex items-center justify-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200"><Store className="w-3 h-3" />{item.outlets?.name}</span>
                          </td>
                          <td className="px-4 py-4 text-right font-bold text-emerald-600">{toRupiah(item.total_amount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-125 print:h-auto print:border-2">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-600">
                  <TrendingDown className="w-5 h-5" />
                  <h2 className="font-bold text-slate-900 text-lg">Rincian Pengeluaran</h2>
                </div>
                <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-md print:hidden">{expenseData?.length || 0} Transaksi</span>
              </div>
              <div className="overflow-y-auto p-2 flex-1 print:overflow-visible custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white z-10 print:static">
                    <tr className="text-xs uppercase tracking-wider text-slate-500 bg-slate-50 rounded-lg">
                      <th className="px-4 py-3 font-semibold rounded-l-lg">Keterangan</th>
                      <th className="px-4 py-3 font-semibold text-center">Tanggal</th>
                      <th className="px-4 py-3 font-semibold text-right rounded-r-lg">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {expenseData?.length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-10 text-slate-400">Belum ada data pengeluaran.</td></tr>
                    ) : (
                      expenseData?.map((item: any) => (
                        <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4"><div className="flex items-center gap-3"><div className="p-2 bg-slate-100 rounded-lg text-slate-500"><ShoppingBag className="w-4 h-4" /></div><p className="font-semibold text-slate-900">{item.description}</p></div></td>
                          <td className="px-4 py-4 text-center text-slate-500 text-xs"><div className="flex items-center justify-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div></td>
                          <td className="px-4 py-4 text-right font-bold text-rose-600">{toRupiah(item.amount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 text-center text-slate-400 text-sm print:hidden">
        © {new Date().getFullYear()} Sistem Keuangan RiRa
      </footer>
    </div>
  )
}