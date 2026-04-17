import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { MAP_ACTION_INSET } from '~/constants/map/mapUi';
import { Theme } from '~/theme/Theme';

const legendItems = [
  { label: 'Trusted Rex', color: 'hsl(20, 90%, 48%)', icon: '👥' },
  { label: 'Saved / Want to Go', color: 'hsl(37, 92%, 50%)', icon: '★' },
  { label: 'Been Here', color: 'hsl(168, 60%, 35%)', icon: '✓' },
  { label: 'Overlap', color: 'hsl(270, 50%, 50%)', icon: '◆' },
];

export const MapLegend: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View
      className="absolute z-[1000] items-start"
      style={{
        position: 'absolute',
        left: MAP_ACTION_INSET,
        bottom: MAP_ACTION_INSET,
        zIndex: 1000,
        elevation: Platform.OS === 'android' ? 14 : 0,
      }}
    >
      <Pressable
        onPress={() => setCollapsed(!collapsed)}
        className="w-[107px] flex-row items-center justify-between gap-1 rounded-xl border border-border bg-card/95 px-2 py-2 shadow-md"
      >
        <Text className="text-xs font-medium text-foreground">🗺️ Legend</Text>
        {collapsed ? (
          <ChevronUp size={12} color={Theme.colors.foreground} />
        ) : (
          <ChevronDown size={12} color={Theme.colors.foreground} />
        )}
      </Pressable>
      {!collapsed ? (
        <View className="mt-1 max-w-[188px] self-start gap-1 rounded-lg border border-border bg-card/95 px-2 py-1.5 shadow-md">
          {legendItems.map((item) => (
            <View key={item.label} className="min-w-0 flex-row items-center gap-1.5 py-0.5">
              <View
                className="h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: item.color }}
              >
                <Text className="text-[9px] text-white">{item.icon}</Text>
              </View>
              <Text className="min-w-0 flex-1 text-[11px] leading-snug text-foreground">{item.label}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};
