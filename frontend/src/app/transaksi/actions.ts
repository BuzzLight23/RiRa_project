'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addIncome(formData: FormData) {
  const supabase = await createClient()

  // 1. Ambil data dari Form
  const outlet_id = formData.get('outlet_id') as string
  const product_id = formData.get('product_id') as string
  const quantity = Number(formData.get('quantity'))

  if (!outlet_id || !product_id || !quantity) return

  // 2. Cek Harga Produk saat ini (biar akurat)
  const { data: product } = await supabase
    .from('products')
    .select('price')
    .eq('id', product_id)
    .single()

  if (!product) return // Jaga-jaga kalau produk gak ketemu

  // 3. Hitung Total
  const total_amount = product.price * quantity

  // 4. Simpan ke Database
  await supabase.from('income_transactions').insert({
    outlet_id,
    product_id,
    quantity,
    total_amount
  })

  // 5. Refresh halaman
  revalidatePath('/transaksi')
}

// Logic Hapus Transaksi (Kalau salah input)
export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  await supabase.from('income_transactions').delete().eq('id', id)
  revalidatePath('/transaksi')
}