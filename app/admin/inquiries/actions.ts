'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { inquiries } from '@/db/schema';

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'] as const;
type Status = typeof STATUSES[number];

export async function updateInquiry(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'));
  const status = String(formData.get('status') ?? '') as Status;
  const notes = String(formData.get('notes') ?? '').slice(0, 5000);

  if (!Number.isFinite(id) || id <= 0) return;
  if (!STATUSES.includes(status)) return;

  await db
    .update(inquiries)
    .set({ status, notes, updatedAt: new Date() })
    .where(eq(inquiries.id, id));

  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
}

export async function deleteInquiry(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'));
  if (!Number.isFinite(id) || id <= 0) return;
  await db.delete(inquiries).where(eq(inquiries.id, id));
  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
}
