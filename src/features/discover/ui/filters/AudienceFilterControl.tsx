import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Filter } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';
import BottomSheet from '~/shared/ui/overlay/BottomSheet';
import SheetHeader from '~/features/collections/ui/common/SheetHeader';
import AudienceFilterOptionsList from '~/features/discover/ui/filters/AudienceFilterOptionsList';

type Props<T extends string> = {
  options: readonly { id: T; label: string }[];
  selected?: readonly T[];
  onApply?: (selected: T[]) => void;
  sectionLabel?: string;
};

function AudienceFilterControl<T extends string>({
  options,
  selected: controlledSelected,
  onApply,
  sectionLabel,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState<readonly T[]>([]);
  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? controlledSelected : localSelected;
  const activeCount = selected.length;
  const isActive = activeCount > 0;

  const close = () => setOpen(false);

  const select = (id: T) => {
    const next = selected.includes(id)
      ? selected.filter((existing) => existing !== id)
      : [...selected, id];
    if (isControlled) onApply?.(next);
    else setLocalSelected(next);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        className={cn(
          'flex-row items-center gap-1.5 rounded-full px-3 py-1.5',
          isActive && 'bg-primary',
        )}
        accessibilityRole="button"
        accessibilityLabel={isActive ? `Filter, ${activeCount} selected` : 'Filter'}
      >
        <Filter
          size={16}
          color={isActive ? Theme.colors.primaryForeground : Theme.colors.foreground}
        />
        <Text
          className={cn(
            'text-sm font-semibold',
            isActive ? 'text-primary-foreground' : 'text-foreground',
          )}
        >
          {isActive ? `Selected: ${activeCount}` : 'Filter'}
        </Text>
      </TouchableOpacity>

      <BottomSheet open={open} onClose={close}>
        <SheetHeader title="Filters" actionLabel="Done" busy={false} onAction={close} />
        <View className="px-4 pt-3">
          <AudienceFilterOptionsList
            selected={selected}
            onSelect={select}
            options={options}
            sectionLabel={sectionLabel}
          />
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
}

export default AudienceFilterControl;
