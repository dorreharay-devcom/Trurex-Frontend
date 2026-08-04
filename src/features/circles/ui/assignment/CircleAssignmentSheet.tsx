import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { useAssignmentSheet } from '~/features/circles/hooks/assignment/useAssignmentSheet';
import AssignableCircleList from '~/features/circles/ui/assignment/AssignableCircleList';
import AssignmentSheetShell from '~/features/circles/ui/assignment/AssignmentSheetShell';
import SectionSpinner from '~/features/circles/ui/common/SectionSpinner';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  open: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
};

const CircleAssignmentSheet = ({ open, onClose, memberId, memberName }: Props) => {
  const sheet = useAssignmentSheet({ open, memberId, onClose });

  return (
    <AssignmentSheetShell open={open} onClose={onClose}>
      <View className="mb-4 flex-row items-start justify-between gap-3">
        <Text className="flex-1 text-center font-display text-lg font-semibold text-foreground">
          Add {memberName} to a Circle?
        </Text>
        <Pressable onPress={onClose} hitSlop={10} className="p-1 active:opacity-70">
          <X size={22} color={Theme.colors.secondaryText} />
        </Pressable>
      </View>

      {sheet.circlesLoading ? (
        <SectionSpinner className="items-center py-8" />
      ) : (
        <AssignableCircleList sheet={sheet} />
      )}

      <Pressable
        onPress={onClose}
        className="mt-4 items-center rounded-xl border border-border py-3 active:bg-muted/40"
      >
        <Text className="text-sm font-medium text-foreground">Skip for now</Text>
      </Pressable>
    </AssignmentSheetShell>
  );
};

export default CircleAssignmentSheet;
