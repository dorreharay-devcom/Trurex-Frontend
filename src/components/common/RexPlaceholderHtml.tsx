import React, { useMemo, useState } from 'react';
import { View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import type { Element } from '@native-html/transient-render-engine';
import RenderHTML from 'react-native-render-html';
import { cn } from '~/utils/general';
import { wrapRexPlaceholderHtmlForFeed } from '~/utils/rexPlaceholderHtml';
import type { RexPlaceholderFit } from '~/components/common/rexPlaceholderFit';

type Props = {
  html: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  fit?: RexPlaceholderFit;
};

function useRexPlaceholderDomVisitors(fit: RexPlaceholderFit, boxW: number, boxH: number) {
  return useMemo(
    () => ({
      onElement(element: Element) {
        if (element.name !== 'svg') return;
        const next = { ...element.attribs };

        if (fit === 'contain') {
          if (boxW > 0) next.width = String(boxW);
          delete next.height;
          next.preserveaspectratio = 'xMidYMid meet';
        } else if (boxW > 0 && boxH > 0) {
          next.width = String(boxW);
          next.height = String(boxH);
          next.preserveaspectratio = 'xMidYMid slice';
        } else {
          next.width = '100%';
          next.height = '100%';
          next.preserveaspectratio = 'xMidYMid slice';
        }

        element.attribs = next;
      },
    }),
    [fit, boxW, boxH],
  );
}

export function RexPlaceholderHtml({ html, className, style, fit = 'cover' }: Props) {
  const { width: winW } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(() => Math.max(1, Math.min(winW, 800)));
  const [box, setBox] = useState({ w: 0, h: 0 });
  const domVisitors = useRexPlaceholderDomVisitors(fit, box.w, box.h);
  const documentHtml = useMemo(() => wrapRexPlaceholderHtmlForFeed(html), [html]);

  const renderKey = `${fit}-${box.w}x${box.h}-${documentHtml.length}`;

  return (
    <View
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={style}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (width > 0 && Math.abs(width - contentWidth) > 0.5) setContentWidth(width);
        if (
          width > 0 &&
          height > 0 &&
          (Math.abs(width - box.w) > 0.5 || Math.abs(height - box.h) > 0.5)
        ) {
          setBox({ w: width, h: height });
        }
      }}
    >
      <View className="absolute inset-0">
        <RenderHTML
          key={renderKey}
          contentWidth={contentWidth}
          source={{ html: documentHtml }}
          domVisitors={domVisitors}
          baseStyle={{ margin: 0, padding: 0, width: '100%', height: '100%' }}
          tagsStyles={{
            body: { margin: 0, padding: 0, width: '100%', height: '100%' },
            div: { width: '100%', height: '100%', minHeight: '100%' },
          }}
        />
      </View>
    </View>
  );
}
