import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, Platform, View, type ViewStyle } from 'react-native';

const FALLBACK_TOP_INSET = 124;
const Z = 25;

const chromeStyle = Platform.select({
  web: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: Z,
  },
  default: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: Z,
    elevation: Z,
  },
}) as ViewStyle;

type Props = {
  topChrome: React.ReactNode;
  children: React.ReactNode;
};

export function StickyTopChromeLayout({ topChrome, children }: Props) {
  const [inset, setInset] = useState(FALLBACK_TOP_INSET);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setInset(h);
  }, []);
  return (
    <View className="min-h-0 flex-1 overflow-hidden bg-background">
      <View onLayout={onLayout} className="bg-background" style={chromeStyle}>
        {topChrome}
      </View>
      <View
        className="min-h-0 flex-1 bg-background"
        style={{ flex: 1, minHeight: 0, paddingTop: inset }}
      >
        {children}
      </View>
    </View>
  );
}
