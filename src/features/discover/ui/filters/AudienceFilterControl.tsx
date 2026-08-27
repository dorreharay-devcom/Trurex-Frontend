import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import BottomSheet from '~/shared/ui/overlay/BottomSheet';
import SheetHeader from '~/features/collections/ui/common/SheetHeader';
import { useDismissOnOutsideInteraction } from '~/features/discover/hooks/useDismissOnOutsideInteraction';
import type { AudienceFilterId } from '~/features/discover/config/audienceFilters';
import AudienceFilterOptionsList from '~/features/discover/ui/filters/AudienceFilterOptionsList';
import WebDropdownPortal from '~/features/discover/ui/filters/WebDropdownPortal';

const DROPDOWN_GAP = 8;
const DROPDOWN_WIDTH = 288;
const DROPDOWN_MARGIN = 16;

type Anchor = { top: number; right: number };

function ShowResultsButton({ onPress, className }: { onPress: () => void; className: string }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} className={className}>
      <Text className="text-sm font-semibold text-primary-foreground">Show Results</Text>
    </TouchableOpacity>
  );
}

const AudienceFilterControl = () => {
  const triggerRef = useRef<View>(null);
  const panelRef = useRef<View>(null);
  const { width: windowWidth } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [selected, setSelected] = useState<Set<AudienceFilterId>>(new Set());

  const close = () => setOpen(false);

  const openDropdown = () => {
    if (!isWeb) {
      setOpen(true);
      return;
    }
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({
        top: y + height + DROPDOWN_GAP,
        right: Math.max(DROPDOWN_MARGIN, windowWidth - (x + width)),
      });
      setOpen(true);
    });
  };

  useDismissOnOutsideInteraction([panelRef, triggerRef], isWeb && open, close);

  const toggle = (id: AudienceFilterId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const trigger = (
    <TouchableOpacity
      ref={triggerRef}
      onPress={openDropdown}
      activeOpacity={0.7}
      className="flex-row items-center gap-1.5"
      accessibilityRole="button"
      accessibilityLabel="Filter"
    >
      <SlidersHorizontal size={16} color={Theme.colors.foreground} />
      <Text className="text-sm font-medium text-foreground">Filter</Text>
    </TouchableOpacity>
  );

  if (isWeb) {
    return (
      <>
        {trigger}
        <WebDropdownPortal active={open}>
          {anchor ? (
            <View
              ref={panelRef}
              className="rounded-xl border border-border bg-card p-4 shadow-lg"
              style={
                {
                  position: 'fixed',
                  top: anchor.top,
                  right: anchor.right,
                  width: DROPDOWN_WIDTH,
                  zIndex: 1000,
                } as never
              }
            >
              <AudienceFilterOptionsList selected={selected} onToggle={toggle} />
              <ShowResultsButton
                onPress={close}
                className="mt-4 w-full items-center rounded-xl bg-primary py-2.5"
              />
            </View>
          ) : null}
        </WebDropdownPortal>
      </>
    );
  }

  return (
    <>
      {trigger}
      <BottomSheet open={open} onClose={close}>
        <SheetHeader title="Filters" actionLabel="Done" busy={false} onAction={close} />
        <View className="px-4 pt-3">
          <AudienceFilterOptionsList selected={selected} onToggle={toggle} />
        </View>
        <View className="mt-4 border-t border-border p-4">
          <ShowResultsButton
            onPress={close}
            className="w-full items-center rounded-xl bg-primary py-3"
          />
        </View>
      </BottomSheet>
    </>
  );
};

export default AudienceFilterControl;
