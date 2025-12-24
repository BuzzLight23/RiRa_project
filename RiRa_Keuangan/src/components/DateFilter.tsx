'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar as CalendarIcon } from 'lucide-react'

export default function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentDate = searchParams.get('date') || ''

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    if (date) {
      router.push(`/?date=${date}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
        <CalendarIcon className="w-4 h-4" />
      </div>
      <input
        type="date"
        value={currentDate}
        onChange={handleDateChange}
        className="pl-10 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm cursor-pointer"
        title="Cari Tanggal Spesifik"
      />
    </div>
  )
}