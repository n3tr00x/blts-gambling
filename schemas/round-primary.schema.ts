import * as z from 'zod';

export const roundPrimarySchema = z.object({
  roundTypeId: z.number().min(1, 'Musisz wybrać typ rundy!'),
  relatedMatchdayId: z.number().min(1).optional(),
  roundDate: z
    .date()
    .refine(val => val instanceof Date || !isNaN(Date.parse(val)), 'Podaj poprawną datę'),
  isHit: z.boolean(),
});

export type RoundPrimarySchema = z.infer<typeof roundPrimarySchema>;
