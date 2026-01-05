import * as z from 'zod';

export const pickFormSchema = z.object({
  picks: z
    .array(
      z.object({
        playerId: z.number().min(1, 'Wybierz zawodnika'),
        leagueId: z.number().min(1, 'Wybierz ligę'),
        odd: z.number().min(1.01, 'Kurs musi być większy niż 1'),
        isChosen: z.boolean(),
        isHit: z.boolean(),
      }),
    )
    .min(1, 'Musisz dodać przynajmniej 1 gracza.')
    .max(5, 'Możesz dodać maksymalnie 5 graczy.'),
});

export type PickFormValues = z.infer<typeof pickFormSchema>;
