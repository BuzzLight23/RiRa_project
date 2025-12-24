'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, LayoutDashboard, DollarSign, Moon, Sun } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  // Toggle Dark Mode (Sederhana via ClassList)
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="font-sans bg-slate-50 dark:bg-slate-900 min-h-screen flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-300">
      
      {/* Background Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-5xl h-[85vh] min-h-[650px] flex shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-800 transition-colors duration-300">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10">
          
          {/* Logo Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/30 transform transition hover:scale-105 text-slate-900">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Dashboard RiRa</h1>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back!</h2>
            <p className="text-slate-500 dark:text-slate-400">Silakan masuk untuk mengelola keuangan.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Input */}
            <div className="group space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-blue-600" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-blue-600">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rira.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-blue-600" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-blue-600">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-200"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input 
                id="remember-me" 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                Ingat saya selama 30 hari
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : 'Masuk ke Akun'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-auto pt-6 text-center text-xs text-slate-400 dark:text-slate-600">
            © 2025 Sistem Keuangan RiRa
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col items-center justify-center p-12 text-center text-white">
          
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 opacity-90"></div>
          
          {/* Floating Blobs */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>

          {/* Glassmorphism Cards Illustration */}
          <div className="relative z-10 max-w-md">
            <div className="mb-12 relative h-56 w-full flex items-center justify-center">
              
              {/* Card 1 (Center) */}
              <div className="absolute w-48 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-20 flex flex-col p-5 animate-float">
                <div className="w-10 h-10 rounded-full bg-yellow-400/90 mb-4 flex items-center justify-center shadow-lg">
                  <DollarSign className="w-5 h-5 text-slate-900" />
                </div>
                <div className="h-2.5 w-24 bg-white/40 rounded-full mb-3"></div>
                <div className="h-2.5 w-16 bg-white/20 rounded-full"></div>
              </div>

              {/* Card 2 (Left) */}
              <div className="absolute w-40 h-28 bg-blue-600/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl transform -rotate-12 -translate-x-20 translate-y-6 z-10 animate-float" style={{ animationDelay: '0.5s' }}>
                 <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
              </div>

              {/* Card 3 (Right) */}
              <div className="absolute w-40 h-28 bg-emerald-500/20 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl transform rotate-12 translate-x-20 translate-y-6 z-10 animate-float" style={{ animationDelay: '1s' }}>
                <div className="absolute bottom-4 left-4 h-1.5 w-12 bg-white/30 rounded-full"></div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 tracking-tight leading-snug">
              Kelola Bisnis Anda <br /> Dengan Percaya Diri
            </h2>
            <p className="text-slate-300 text-lg font-light leading-relaxed">
              Pantau penjualan, kelola pengeluaran, dan monitor keuntungan dalam satu dashboard yang mudah digunakan.
            </p>
          </div>

          {/* Bottom Border Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-blue-500 to-emerald-500"></div>
        </div>

      </div>

      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}