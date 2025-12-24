'use client'

import { createClient } from '@/lib/supabase/client' // Pastikan path ini benar (client supabase)
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { useState } from 'react'

export default function UserNav({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.replace('/') // Kembali ke login
  }

  // Jika user tidak ada (belum login), jangan tampilkan apa-apa
  if (!user) return null

  // Ambil huruf depan email untuk Avatar (misal: "b" dari buzzlight...)
  const initial = user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="relative">
      {/* 1. Trigger Tombol Profil */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-slate-800 p-2 rounded-lg transition-colors group"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">
            Halo, Kak!
          </p>
          <p className="text-xs text-slate-400 max-w-[150px] truncate">
            {user.email}
          </p>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-yellow-400/20">
          {initial}
        </div>
      </button>

      {/* 2. Dropdown Menu (Muncul pas diklik) */}
      {isOpen && (
        <>
          {/* Layar transparan buat nutup dropdown kalo klik diluar */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 border-b border-slate-100 mb-2">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Akun Aktif</p>
              <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Keluar Aplikasi
            </button>
          </div>
        </>
      )}
    </div>
  )
}