import * as z from 'zod';

import { pickFormSchema } from './pick-form.schema';
import { roundPrimarySchema } from './round-primary.schema';
import { votesTableSchema } from './votes-form.schema';

export const newRoundValues = roundPrimarySchema
  .extend(pickFormSchema.shape)
  .extend(votesTableSchema.shape);

export type NewRoundValues = z.infer<typeof newRoundValues>;
