import React from 'react';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import Search from './Search';

type Props = {
  flow: CreateRecFlow;
  onTagLocation: () => void;
  tagLocationLoading: boolean;
};

function SearchStep({ flow, onTagLocation, tagLocationLoading }: Props) {
  return (
    <Search
      place={flow.place}
      onTagLocationPress={onTagLocation}
      tagLocationLoading={tagLocationLoading}
    />
  );
}

export default SearchStep;
