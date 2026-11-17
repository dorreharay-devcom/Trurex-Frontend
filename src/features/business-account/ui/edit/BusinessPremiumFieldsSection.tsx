import React from 'react';
import { Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import { BUSINESS_PREMIUM_BADGE } from '~/features/business-account/config/copy';
import { BUSINESS_PREMIUM_FIELDS } from '~/features/business-account/config/edit';
import { Theme } from '~/shared/theme/Theme';

function BusinessPremiumFieldsSection() {
  return (
    <View className="gap-3 rounded-xl border border-border bg-background p-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-sm font-semibold text-foreground" accessibilityRole="header">
          More business details
        </Text>
        <View className="rounded-full bg-accent px-2.5 py-1">
          <Text className="text-xs font-medium text-accent-foreground">
            {BUSINESS_PREMIUM_BADGE}
          </Text>
        </View>
      </View>
      {BUSINESS_PREMIUM_FIELDS.map((field) => (
        <View
          key={field.id}
          className="flex-row items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-3 opacity-60"
          accessible
          accessibilityLabel={`${field.label}. ${BUSINESS_PREMIUM_BADGE}`}
          accessibilityState={{ disabled: true }}
        >
          <Text className="text-base text-muted-foreground">{field.label}</Text>
          <Lock size={16} color={Theme.colors.muted} />
        </View>
      ))}
      <Text className="text-xs text-muted-foreground">
        Phone number, opening hours, social media and booking links will be available with a Premium
        business account.
      </Text>
    </View>
  );
}

export default BusinessPremiumFieldsSection;
