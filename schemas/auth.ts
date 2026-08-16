import z from 'zod';

export const emailStepFormSchema = z
  .email({ message: 'Niepoprawny adres e-mail' })
  .min(1, { message: 'Email jest wymagany' });
