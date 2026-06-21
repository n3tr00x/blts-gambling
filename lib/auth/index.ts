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

export async function sendOtpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });

  if (error && error.status === 422) {
    console.error(error);
    return {
      success: false,
      message: 'Podany e-mail nie jest zarejestrowany.',
    };
  }

  if (error) {
    console.error(error);
    return {
      success: false,
      message: 'Wystąpił błąd podczas logowania.',
    };
  }

  return {
    message: 'Pomyślnie wysłano kod weryfikacyjny. Sprawdź swoją skrzynkę odbiorczą.',
    success: true,
  };
}

export async function verifyOtpAction(initialData: unknown, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const otp = formData.get('otp') as string;

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });

  if (error && error.status === 403) {
    console.error(error);
    return {
      success: false,
      message: 'Token weryfikacyjny wygasł lub jest nieprawidłowy.',
    };
  }

  if (error) {
    console.error(error);
    return { success: false, message: 'Wystąpił błąd podczas weryfikacji kodu.' };
  }

  revalidatePath('/');

  return { success: true, message: 'Pomyślnie zalogowano.' };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect('/');
}
