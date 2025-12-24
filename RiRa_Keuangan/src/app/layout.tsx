// 1. Import Server Client & Komponen UserNav
import { createServerClient } from '@supabase/ssr' // Atau helper server kamu
import { cookies } from 'next/headers'
import UserNav from '@/components/UserNav' // Import komponen baru
import Link from 'next/link'
import './globals.css'

// ... (kode metadata dll biarkan saja) ...

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 2. AMBIL DATA USER DI SINI (SERVER SIDE)
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

  // Cek siapa yang login
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="id">
      <body className="bg-slate-50">
        
        {/* HEADER GLOBAL */}
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Logo Kiri */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-slate-900">R</span>
                </div>
                <span className="text-white font-bold text-lg hidden sm:block">Dashboard RiRa</span>
              </div>

              {/* Bagian Kanan (Tombol User) */}
              <div className="flex items-center gap-4">
                {/* 3. PANGGIL KOMPONEN USERNAV & OPER DATA USER */}
                {/* Kalau user ada, tombol profil muncul. Kalau null, tombol tidak muncul */}
                <UserNav user={user} />
              </div>

            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  )
}