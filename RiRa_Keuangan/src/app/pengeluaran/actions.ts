'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Simpan Pengeluaran
export async function addExpense(formData: FormData) {
  const supabase = await createClient()

  const description = formData.get('description') as string
  const amount = Number(formData.get('amount'))

  if (!description || !amount) return

  const { error } = await supabase.from('expense_transactions').insert({
    description,
    amount
  })

  if (error) console.log(error)

  revalidatePath('/pengeluaran')
}

// Hapus Pengeluaran
export async function deleteExpense(id: string) {
  const supabase = await createClient()
  await supabase.from('expense_transactions').delete().eq('id', id)
  revalidatePath('/pengeluaran')
}