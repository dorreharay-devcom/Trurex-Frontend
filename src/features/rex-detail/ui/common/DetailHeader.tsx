import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ArrowLeft, Flag, Trash2, Pencil } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/utils';
import HeaderActionPill from './HeaderActionPill';

type HeaderActionsProps = {
  isOwner: boolean;
  showReport: boolean;
  onEdit: (() => void) | undefined;
  onDelete: () => void;
  onReport: () => void;
};

function HeaderActions({ isOwner, showReport, onEdit, onDelete, onReport }: HeaderActionsProps) {
  if (isOwner) {
    return (
      <View className="flex-row items-center justify-end gap-2">
        {onEdit ? (
          <HeaderActionPill
            icon={Pencil}
            label="Edit"
            accessibilityLabel="Edit this recommendation"
            variant="primary"
            onPress={onEdit}
          />
        ) : null}
        <HeaderActionPill
          icon={Trash2}
          label="Delete"
          accessibilityLabel="Delete this recommendation"
          variant="destructive"
          onPress={onDelete}
        />
      </View>
    );
  }
  if (showReport) {
    return (
      <HeaderActionPill
        icon={Flag}
        label="Report"
        accessibilityLabel="Report this recommendation"
        variant="destructive"
        iconFill
        onPress={onReport}
      />
    );
  }
  return null;
}

type Props = HeaderActionsProps & {
  onBack: () => void;
};

function DetailHeader({ isOwner, showReport, onBack, onEdit, onDelete, onReport }: Props) {
  return (
    <View
      className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 py-4 backdrop-blur sm:px-6"
      style={!isWeb ? { position: 'relative', zIndex: 50, elevation: 50 } : undefined}
    >
      <View className="flex-row items-center">
        <View className="w-[60px] items-start justify-center">
          <Pressable
            onPress={onBack}
            className="flex-row items-center gap-1.5 rounded-lg py-0.5 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ArrowLeft size={20} color={Theme.colors.secondaryText} />
            <Text className="text-sm font-medium text-foreground">Back</Text>
          </Pressable>
        </View>
        <View className="min-w-0 flex-1" />
        <View className="w-[152px] shrink-0 items-end justify-center">
          <HeaderActions
            isOwner={isOwner}
            showReport={showReport}
            onEdit={onEdit}
            onDelete={onDelete}
            onReport={onReport}
          />
        </View>
      </View>
    </View>
  );
}

export default DetailHeader;
