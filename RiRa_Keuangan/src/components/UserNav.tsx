'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export default function UserNav({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.replace('/') 
  }

  if (!user) return null

  const initial = user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-yellow-400 font-bold border border-slate-700 transition-all shadow-sm"
        title={user.email}
      >
        {initial}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}/>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-1 animate-in fade-in zoom-in-95">
            <div className="px-4 py-2 border-b border-slate-50">
              <p className="text-xs text-slate-400">Login sebagai:</p>
              <p className="text-xs font-bold text-slate-800 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </>
      )}
    </div>
  )
}