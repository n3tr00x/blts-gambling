import * as z from 'zod';

export const emailStepFormSchema = z
  .email({ message: 'Niepoprawny adres e-mail' })
  .min(1, { message: 'Email jest wymagany' });

export const otpStepFormSchema = z
  .string()
  .min(1, { message: 'Kod OTP jest wymagany' })
  .length(6, { message: 'Kod OTP musi mieć dokładnie 6 znaków' });
