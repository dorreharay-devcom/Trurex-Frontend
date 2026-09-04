import React from 'react';
import { View, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import type { ConfirmAuthorPreview } from '~/features/rex-create/lib/confirmPreview';

type Props = {
  author: ConfirmAuthorPreview;
  categories: { emoji: string; label: string }[];
  lookingForText: string;
  locationText: string | null;
  needByLabel: string;
  note: string;
  sharingLabel: string;
};

function ConfirmPreviewCard({
  author,
  categories,
  lookingForText,
  locationText,
  needByLabel,
  note,
  sharingLabel,
}: Props) {
  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <View className="flex-row items-center gap-3 p-4 pb-3">
        <View className="h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-sand">
          <Text className="text-xs font-semibold text-sand-dark">{author.initials}</Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-semibold text-foreground">{author.name}</Text>
          <Text className="mt-0.5 text-xs text-muted-foreground">
            {author.handle ? `${author.handle} · ` : ''}just now
          </Text>
        </View>
        <View className="max-w-[52%] shrink-0 flex-row flex-wrap justify-end gap-1">
          {categories.map((category, index) => (
            <View
              key={`${category.label}-${index}`}
              className="rounded-full border border-border bg-muted/50 px-2.5 py-1"
            >
              <Text className="text-xs font-medium text-black" numberOfLines={2}>
                {category.emoji} {category.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="px-4 pb-2">
        <Text className="font-display text-lg font-bold text-foreground">{lookingForText}</Text>
        {locationText ? (
          <View className="mt-1.5 flex-row items-center gap-1">
            <MapPin size={12} color={Theme.colors.secondaryText} />
            <Text className="flex-1 text-xs text-muted-foreground">{locationText}</Text>
          </View>
        ) : null}
      </View>

      {note ? (
        <Text className="px-4 pb-3 text-sm leading-5 text-foreground opacity-85">{note}</Text>
      ) : null}

      <View className="border-t border-border bg-muted/30 px-4 py-3">
        <Text className="mb-1 text-xs leading-5 text-muted-foreground">
          Need by: <Text className="font-medium text-foreground">{needByLabel}</Text>
        </Text>
        <Text className="text-xs leading-5 text-muted-foreground">
          Sharing to: <Text className="font-medium text-foreground">{sharingLabel}</Text>
        </Text>
      </View>
    </View>
  );
}

export default ConfirmPreviewCard;
