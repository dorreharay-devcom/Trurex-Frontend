import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Share2 } from 'lucide-react-native';
import BottomSheet from '~/shared/ui/overlay/BottomSheet';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { withWebContainer } from '~/shared/lib/ui/styles';

type Props = {
  open: boolean;
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ShareToFeedPrompt = ({ open, pending, onConfirm, onCancel }: Props) => (
  <BottomSheet open={open} onClose={onCancel}>
    <View
      style={withWebContainer({
        paddingHorizontal: 16,
        paddingTop: isWeb ? 24 : 0,
        paddingBottom: 24,
      })}
    >
      <View className="mb-4 h-12 w-12 items-center justify-center self-center rounded-full bg-primary/10">
        <Share2 size={22} color={Theme.colors.primary} />
      </View>
      <Text className="mb-1 text-center font-display text-lg font-bold text-foreground">
        Share to feed?
      </Text>
      <Text className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
        Would you like to share this collection to the feed?
      </Text>
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={onCancel}
          disabled={pending}
          activeOpacity={0.85}
          className="flex-1 items-center rounded-xl border border-border bg-muted/50 py-2.5"
        >
          <Text className="text-sm font-semibold text-foreground">No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onConfirm}
          disabled={pending}
          activeOpacity={0.85}
          className="flex-1 items-center justify-center rounded-xl bg-primary py-2.5"
        >
          {pending ? (
            <ActivityIndicator size="small" color={Theme.colors.background} />
          ) : (
            <Text className="text-sm font-semibold text-primary-foreground">Yes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </BottomSheet>
);

export default ShareToFeedPrompt;
