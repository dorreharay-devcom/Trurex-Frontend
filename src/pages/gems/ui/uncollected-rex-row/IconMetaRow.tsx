import React from 'react';
import { Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { singleLineEllipsisTextStyle } from '~/shared/lib/ui/styles';

type Props = {
  icon: LucideIcon;
  text: string | null | undefined;
};

function IconMetaRow({ icon: Icon, text }: Props) {
  if (!text) return null;

  return (
    <View className="mt-1 min-w-0 flex-row items-center gap-0.5 overflow-hidden">
      <Icon size={10} color={Theme.colors.muted} style={{ flexShrink: 0 }} />
      <Text
        className="text-[11px] text-muted-foreground"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={singleLineEllipsisTextStyle}
      >
        {text}
      </Text>
    </View>
  );
}

export default IconMetaRow;
