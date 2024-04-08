'use server'

import { z } from 'zod'
import { Invoice } from './definitions'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const InvoiceFormSchema = z.object({
    customerId: z.string(),
    amount: z.number(),
    status: z.enum(['draft', 'paid', 'pending']),
    date: z.string(),
})

const CreateInvoiceFormSchema = InvoiceFormSchema.omit({ 
    id: true,
    date: true,
})

export async function createInvoice (formData: FormData) {
    const { customerId, amount, status} = CreateInvoiceFormSchema.parse( {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })

    //transformamos para evitar errores de redondeo
    const amountInCents = amount * 100

    //fecha actual
    const [date] = new Date().toISOString().split('T')

    console.log({
        customerId,
        amountInCents,
        status,
        date,
    })

    await sql`
     INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    ` 

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')

    // const rawFormData = Object.fromEntries(formData.entries())
    
}