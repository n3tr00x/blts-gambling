'use client';

import { SetStateAction, useState } from 'react';
import { Tag, TagInput } from 'emblor';

import { Field, FieldLabel } from '@/components/ui/field';

type RoundNumberFilterProps = {
  value: Tag[];
  onSetTags: (tags: Tag[]) => void;
};

export function RoundNumberFilter({ value, onSetTags }: RoundNumberFilterProps) {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const handleSetTags = (newTagsOrFn: SetStateAction<Tag[]>) => {
    const newTags = typeof newTagsOrFn === 'function' ? newTagsOrFn(value) : newTagsOrFn;
    onSetTags(newTags);
  };

  return (
    <Field>
      <FieldLabel htmlFor="round-number-filter">Rundy</FieldLabel>
      <TagInput
        id="round-number-filter"
        tags={value}
        setTags={handleSetTags}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        styleClasses={{ inlineTagsContainer: 'bg-transparent' }}
      />
    </Field>
  );
}
