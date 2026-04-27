'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { craftItems, edgeRows, faqItems } from '@/db/schema';

function clean(s: FormDataEntryValue | null, max = 2000): string {
  return String(s ?? '').slice(0, max).trim();
}

export async function updateCraft(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!Number.isFinite(id) || id <= 0) return;
  const bullets = clean(formData.get('bullets'), 4000)
    .split('\n')
    .map((b) => b.trim())
    .filter(Boolean);
  await db
    .update(craftItems)
    .set({
      title: clean(formData.get('title'), 200),
      meta: clean(formData.get('meta'), 200),
      body: clean(formData.get('body'), 2000),
      bullets,
      updatedAt: new Date(),
    })
    .where(eq(craftItems.id, id));
  revalidatePath('/craft');
  revalidatePath('/admin/content');
}

export async function updateFaq(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!Number.isFinite(id) || id <= 0) return;
  await db
    .update(faqItems)
    .set({
      question: clean(formData.get('question'), 500),
      answer: clean(formData.get('answer'), 4000),
      updatedAt: new Date(),
    })
    .where(eq(faqItems.id, id));
  revalidatePath('/faq');
  revalidatePath('/admin/content');
}

export async function updateEdge(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!Number.isFinite(id) || id <= 0) return;
  await db
    .update(edgeRows)
    .set({
      dimension: clean(formData.get('dimension'), 200),
      us: clean(formData.get('us'), 500),
      them: clean(formData.get('them'), 500),
      updatedAt: new Date(),
    })
    .where(eq(edgeRows.id, id));
  revalidatePath('/edge');
  revalidatePath('/admin/content');
}
