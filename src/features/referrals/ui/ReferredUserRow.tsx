import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import { cn } from '~/shared/lib/ui/styles';
import { formatProfileHandle } from '~/features/profile/lib/handle';
import type { ReferredUser } from '~/features/referrals/types/referral';

function referralStatus(user: ReferredUser): { label: string; tone: 'muted' | 'success' } {
  if (user.signup_rewarded && user.activation_rewarded) {
    return { label: 'Fully rewarded', tone: 'success' };
  }
  if (user.activation_rewarded) {
    return { label: 'Activation reward earned', tone: 'success' };
  }
  if (user.signup_rewarded) {
    return { label: 'Awaiting first Rex', tone: 'muted' };
  }
  return { label: 'Joined', tone: 'muted' };
}

type Props = {
  user: ReferredUser;
  onPress: () => void;
};

function ReferredUserRow({ user, onPress }: Props) {
  const status = referralStatus(user);
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
      <View
        className={cn(
          'shrink-0 rounded-full border px-2.5 py-1',
          status.tone === 'success'
            ? 'border-primary/40 bg-primary/10'
            : 'border-border/80 bg-border/40',
        )}
      >
        <Text className="text-[10px] font-medium text-foreground">{status.label}</Text>
      </View>
    </Pressable>
  );
}

export default ReferredUserRow;
