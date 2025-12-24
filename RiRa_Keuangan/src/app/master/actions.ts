'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ... logic addProduct ...
export async function addProduct(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const price = formData.get('price') as string

  if (!name || !price) return

  await supabase.from('products').insert({
    name,
    price: Number(price)
  })
  revalidatePath('/master')
}

export async function addOutlet(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const address = formData.get('address') as string 

  if (!name) return

  await supabase.from('outlets').insert({
    name,
    address
  })

  revalidatePath('/master')
}

export async function deleteItem(id: string, table: 'products' | 'outlets') {
  const supabase = await createClient()
  await supabase.from(table).delete().eq('id', id)
  revalidatePath('/master')
}