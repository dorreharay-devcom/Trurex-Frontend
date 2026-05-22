import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { MAP_ACTION_INSET } from '~/constants/map/mapUi';
import { MAP_PIN_COLOR, MAP_PIN_GLYPH, MAP_PIN_GLYPH_COLOR } from '~/types/map/mapPin';
import { Theme } from '~/theme/Theme';

const legendItems = [
  { label: 'Trusted Rex', pinType: 'network' as const },
  { label: 'Saved / Want to Go', pinType: 'saved' as const },
  { label: 'Been Here', pinType: 'beenHere' as const },
  { label: 'Overlap', pinType: 'overlap' as const },
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
        <View
          className="mt-1 self-start gap-1 rounded-lg border border-border bg-card/95 px-2 py-1.5 shadow-md"
          style={
            Platform.OS === 'ios'
              ? { width: 150 }
              : Platform.OS === 'android'
                ? { width: 188 }
                : undefined
          }
        >
          {legendItems.map((item) => (
            <View key={item.label} className="min-w-0 flex-row items-center gap-1.5 py-0.5">
              <View
                className="h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: MAP_PIN_COLOR[item.pinType] }}
              >
                <Text className="text-[9px]" style={{ color: MAP_PIN_GLYPH_COLOR[item.pinType] }}>
                  {MAP_PIN_GLYPH[item.pinType]}
                </Text>
              </View>
              <Text className="min-w-0 flex-1 text-[11px] leading-snug text-foreground">
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};
