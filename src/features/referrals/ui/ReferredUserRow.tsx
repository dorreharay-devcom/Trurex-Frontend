import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import { cn } from '~/shared/lib/ui/styles';
import { formatProfileHandle } from '~/features/profile/lib/handle';
import type { ReferredUser } from '~/features/referrals/types/referral';

type StatusTone = 'muted' | 'success' | 'complete' | 'pending';

const STATUS_TONE_STYLES: Record<StatusTone, { pill: string; text: string }> = {
  muted: { pill: 'border-border/80 bg-border/40', text: 'text-foreground' },
  success: { pill: 'border-primary/40 bg-primary/10', text: 'text-foreground' },
  complete: { pill: 'border-green-500/40 bg-green-500/10', text: 'text-green-700' },
  pending: { pill: 'border-yellow-500/40 bg-yellow-500/10', text: 'text-yellow-700' },
};

function referralStatus(user: ReferredUser): { label: string; tone: StatusTone } {
  if (user.signup_rewarded && user.activation_rewarded) {
    return { label: 'Fully rewarded', tone: 'complete' };
  }
  if (user.activation_rewarded) {
    return { label: 'Activation reward earned', tone: 'success' };
  }
  if (user.signup_rewarded) {
    return { label: 'Awaiting first Rex', tone: 'pending' };
  }
  return { label: 'Joined', tone: 'muted' };
}

type Props = {
  user: ReferredUser;
  onPress: () => void;
};

function ReferredUserRow({ user, onPress }: Props) {
  const status = referralStatus(user);
  const toneStyle = STATUS_TONE_STYLES[status.tone];
  const handle = formatProfileHandle(user.handle);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={user.display_name}
      className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
    >
      <SignedUserAvatar name={user.display_name} avatar={user.avatar_url} sizePt={36} />
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
          {user.display_name}
        </Text>
        {handle ? (
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {handle}
          </Text>
        ) : null}
      </View>
      <View className={cn('shrink-0 rounded-full border px-2.5 py-1', toneStyle.pill)}>
        <Text className={cn('text-[10px] font-medium', toneStyle.text)}>{status.label}</Text>
      </View>
    </Pressable>
  );
}

export default ReferredUserRow;
