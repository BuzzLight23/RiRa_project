import { Wallet } from 'lucide-react'

export default function Loading() {
  const dummyItems = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      <div className="bg-slate-900/90 h-16 border-b border-slate-800 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-800"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center opacity-50">
              <Wallet className="w-6 h-6 text-slate-600" />
            </div>
            <div className="h-6 w-48 bg-slate-800 rounded-md"></div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 space-y-8">
              <div className="h-5 w-32 bg-slate-200 rounded mb-6"></div>
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  <div className="h-12 w-full bg-slate-100 rounded-xl border border-slate-200"></div>
                </div>
              ))}

              <div className="h-14 w-full bg-slate-200 rounded-xl mt-8"></div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[500px]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
               <div className="h-6 w-40 bg-slate-200 rounded"></div>
               <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
            </div>

            <div className="p-4 space-y-4">
              {dummyItems.map((item) => (
                <div key={item} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    <div className="h-3 w-24 bg-slate-200 rounded"></div>
                  </div>
                  <div className="space-y-2 items-end flex flex-col">
                     <div className="h-4 w-20 bg-slate-200 rounded"></div>
                     <div className="h-3 w-16 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}