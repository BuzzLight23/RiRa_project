'use client'

import { FileSpreadsheet, Printer } from 'lucide-react'

interface Props {
  incomeData: any[]
  expenseData: any[]
  period: string
}

export default function DownloadReport({ incomeData, expenseData, period }: Props) {
  
  // Logic Export Excel (CSV)
  const handleDownloadExcel = () => {
    const headers = ['Tanggal', 'Tipe', 'Keterangan', 'Lokasi/Warung', 'Jumlah (Rp)']
    
    const incomeRows = incomeData.map(item => [
      new Date(item.created_at).toLocaleDateString('id-ID'),
      'Pemasukan',
      `Penjualan ${item.products?.name} (x${item.quantity})`,
      item.outlets?.name || '-',
      item.total_amount
    ])

    const expenseRows = expenseData.map(item => [
      new Date(item.created_at).toLocaleDateString('id-ID'),
      'Pengeluaran',
      item.description,
      '-',
      item.amount * -1
    ])

    const allRows = [headers, ...incomeRows, ...expenseRows]
    const csvContent = allRows.map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Laporan_Keuangan_RiRa_${period}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Logic Export PDF (Via Print Browser)
  const handlePrintPDF = () => {
    window.print()
  }

  return (
    <div className="flex gap-2 print:hidden">
      {/* Tombol PDF / Print */}
      <button 
        onClick={handlePrintPDF}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition shadow-sm"
        title="Cetak atau Simpan sebagai PDF"
      >
        <Printer className="w-4 h-4" /> PDF / Cetak
      </button>

      {/* Tombol Excel */}
      <button 
        onClick={handleDownloadExcel}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
      >
        <FileSpreadsheet className="w-4 h-4" /> Excel
      </button>
    </div>
  )
}