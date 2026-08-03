import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Bookmark, Trash2, type LucideIcon } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import type { SavedRexActionsState } from '~/features/collections/hooks/add-to-collection/useSavedRexActions';
import { cn } from '~/shared/lib/ui/styles';

type ActionButtonProps = {
  icon: LucideIcon;
  label: string;
  busy: boolean;
  destructive?: boolean;
  onPress: () => void;
};

function ActionButton({ icon: Icon, label, busy, destructive, onPress }: ActionButtonProps) {
  const color = destructive ? Theme.colors.destructive : Theme.colors.foreground;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={busy}
      className={cn(
        'w-full flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg border',
        destructive ? 'border-destructive' : 'border-border',
      )}
    >
      {busy ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <>
          <Icon size={14} color={color} />
          <Text
            className={cn(
              'text-sm font-medium',
              destructive ? 'text-destructive' : 'text-foreground',
            )}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function UncollectedActions({ saved }: { saved: SavedRexActionsState }) {
  if (saved.isRexSaved) {
    return (
      <ActionButton
        icon={Trash2}
        label="Remove from uncollected"
        busy={saved.removing}
        destructive
        onPress={() => void saved.removeFromUncollected()}
      />
    );
  }
  return (
    <ActionButton
      icon={Bookmark}
      label="Save to uncollected"
      busy={saved.savingUncollected}
      onPress={() => void saved.saveToUncollected()}
    />
  );
}

export default UncollectedActions;
