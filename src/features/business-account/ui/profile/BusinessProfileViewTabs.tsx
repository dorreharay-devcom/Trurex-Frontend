import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  BUSINESS_PROFILE_VIEWS,
  type BusinessProfileView,
} from '~/features/business-account/config/businessProfileView';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  view: BusinessProfileView;
  onChange: (view: BusinessProfileView) => void;
};

function BusinessProfileViewTabs({ view, onChange }: Props) {
  return (
    <View className="flex-row border-b border-border" accessibilityRole="tablist">
      {BUSINESS_PROFILE_VIEWS.map((tab) => {
        const selected = view === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onChange(tab.id)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            className="flex-1 items-center py-3"
          >
            <Text
              className={cn(
                'text-sm font-semibold',
                selected ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {tab.label}
            </Text>
            {selected ? (
              <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default BusinessProfileViewTabs;
