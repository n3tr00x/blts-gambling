'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signInAction(initialData: unknown, formData: FormData) {
  const supabase = await createClient();

  const rawFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(rawFormData);

  if (error) {
    console.log(error);
    return { message: error.message, success: false };
  }

  revalidatePath('/');
  return {
    message: 'Pomyślnie zalogowano.',
    success: true,
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect('/');
}
