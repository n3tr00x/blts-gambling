'use client';

import { useCallback, useState } from 'react';
import { Tag } from 'emblor';

interface RoundFilterFormState {
  correct: boolean | undefined;
  roundNumbers: Tag[];
  seasonId: number | undefined;
  roundTypeId: number | undefined;
}

type UseRoundFilterFormProps = {
  initialFilters: RoundFilterFormState;
};

export const useRoundFilterForm = ({ initialFilters }: UseRoundFilterFormProps) => {
  const [filters, setFilters] = useState<RoundFilterFormState>({
    correct: initialFilters.correct,
    roundNumbers: initialFilters.roundNumbers,
    seasonId: initialFilters.seasonId,
    roundTypeId: initialFilters.roundTypeId,
  });

  const setFilter = useCallback(
    <K extends keyof RoundFilterFormState>(key: K, value: RoundFilterFormState[K]) => {
      setFilters(prev => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFilters({
      correct: undefined,
      roundNumbers: [],
      seasonId: undefined,
      roundTypeId: undefined,
    });
  }, []);

  return { filters, setFilter, resetForm };
};
