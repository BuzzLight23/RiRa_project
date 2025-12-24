'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown, Search, Store } from 'lucide-react'

interface Outlet {
  id: string
  name: string
}

export default function OutletPicker({ outlets }: { outlets: Outlet[] }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [query, setQuery] = useState("")
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Filter logika
  const filteredOutlets = query === ''
    ? outlets
    : outlets.filter((outlet) =>
        outlet.name.toLowerCase().includes(query.toLowerCase())
      )

  const selectedName = outlets.find((o) => o.id === value)?.name

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  return (
    <div className="space-y-2 group" ref={wrapperRef}>
      <input type="hidden" name="outlet_id" value={value} />

      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 transition-colors group-focus-within:text-blue-600">
        Lokasi Warung
      </label>
      
      <div className="relative">
        {/* Ikon Toko */}
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${open ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
          <Store className="w-5 h-5" />
        </div>

        {/* Tombol Trigger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full pl-12 pr-10 py-3.5 text-left border rounded-xl outline-none transition-all duration-300 text-sm font-medium 
            ${open ? 'bg-white ring-4 ring-blue-500/10 border-blue-500' : 'bg-slate-50 border-slate-200 hover:bg-white'}
            ${!selectedName ? 'text-slate-500' : 'text-slate-800'}
          `}
        >
          {selectedName || "Pilih Warung..."}
        </button>

        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
          <ChevronsUpDown className="w-4 h-4 opacity-50" />
        </div>

        {/* Dropdown List */}
        {open && (
          <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Search Bar */}
            <div className="flex items-center border-b border-slate-100 px-3 py-2 bg-slate-50/50">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent border-none text-sm focus:ring-0 text-slate-700 placeholder:text-slate-400"
                placeholder="Cari nama warung..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>

            {/* List Item */}
            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
              {filteredOutlets.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-400">
                  Tidak ditemukan.
                </div>
              ) : (
                filteredOutlets.map((outlet) => (
                  <div
                    key={outlet.id}
                    onClick={() => {
                      setValue(outlet.id)
                      setOpen(false)
                      setQuery("")
                    }}
                    className={`
                      cursor-pointer px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between
                      ${value === outlet.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}
                    `}
                  >
                    {outlet.name}
                    {value === outlet.id && <Check className="w-4 h-4" />}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}