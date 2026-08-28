import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Filter } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import BottomSheet from '~/shared/ui/overlay/BottomSheet';
import SheetHeader from '~/features/collections/ui/common/SheetHeader';
import {
  AUDIENCE_FILTER_OPTIONS,
  type AudienceFilterId,
} from '~/features/discover/config/audienceFilters';
import AudienceFilterOptionsList from '~/features/discover/ui/filters/AudienceFilterOptionsList';

type Props = {
  options?: readonly { id: AudienceFilterId; label: string }[];
};

const AudienceFilterControl = ({ options = AUDIENCE_FILTER_OPTIONS }: Props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<AudienceFilterId>>(new Set());

  const close = () => setOpen(false);

  const toggle = (id: AudienceFilterId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        className="flex-row items-center gap-1.5"
        accessibilityRole="button"
        accessibilityLabel="Filter"
      >
        <Filter size={16} color={Theme.colors.foreground} />
        <Text className="text-sm font-medium text-foreground">Filter</Text>
      </TouchableOpacity>

      <BottomSheet open={open} onClose={close}>
        <SheetHeader title="Filters" actionLabel="Done" busy={false} onAction={close} />
        <View className="px-4 pt-3">
          <AudienceFilterOptionsList selected={selected} onToggle={toggle} options={options} />
        </View>
        <View className="mt-4 border-t border-border p-4">
          <TouchableOpacity
            onPress={close}
            activeOpacity={0.85}
            className="w-full items-center rounded-xl bg-primary py-3"
          >
            <Text className="text-sm font-semibold text-primary-foreground">Show Results</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </>
  );
};

export default AudienceFilterControl;
