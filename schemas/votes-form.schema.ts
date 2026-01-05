import * as z from 'zod';

export const votesTableSchema = z.object({
  votes: z.array(
    z.object({
      voterId: z.number(),
      votesFor: z.array(z.number()).max(2, 'Gracz może oddać maksymalnie 2 głosy'),
    }),
  ),
});

export type VotesTableFormValues = z.infer<typeof votesTableSchema>;
