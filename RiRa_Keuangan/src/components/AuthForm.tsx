'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, LayoutDashboard, DollarSign, Moon, Sun } from 'lucide-react'

// State awal
const initialState = {
  error: '',
}

export default function AuthForm() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="font-sans bg-slate-50 dark:bg-slate-900 min-h-screen flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-300">
      
      {/* Background Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative w-full max-w-5xl h-[85vh] min-h-[650px] flex shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-800 transition-colors duration-300">
        
        {/* Kiri: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg text-slate-900">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard RiRa</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back!</h2>
            <p className="text-slate-500 dark:text-slate-400">Silakan masuk untuk mengelola keuangan.</p>
          </div>

          {state?.error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 text-sm font-medium rounded-xl">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div className="group space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input name="email" type="email" placeholder="Masukkan Email Anda" required className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white transition-all" />
              </div>
            </div>

            <div className="group space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isPending} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70">
              {isPending ? 'Memproses...' : 'Masuk Dashboard'}
            </button>
          </form>
          
          <div className="mt-auto pt-6 text-center text-xs text-slate-400">© 2025 Sistem Keuangan RiRa</div>
        </div>

        {/* Kanan: Ilustrasi */}
        <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col items-center justify-center p-12 text-center text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-900 opacity-90"></div>
          <div className="relative z-10 max-w-md">
            <h2 className="text-3xl font-bold mb-4">Kelola Bisnis Anda <br /> Dengan Percaya Diri</h2>
            <p className="text-slate-300 text-lg font-light">Pantau penjualan, kelola pengeluaran, dan monitor keuntungan dalam satu dashboard.</p>
          </div>
        </div>
      </div>


      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  )
}