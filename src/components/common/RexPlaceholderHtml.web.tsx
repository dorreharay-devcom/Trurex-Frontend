import React, { useMemo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { cn } from '~/utils/general';
import { wrapRexPlaceholderHtmlForFeed } from '~/utils/rexPlaceholderHtml';
import type { RexPlaceholderFit } from '~/components/common/rexPlaceholderFit';

type Props = {
  html: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  fit?: RexPlaceholderFit;
};

export function RexPlaceholderHtml({ html, className, style }: Props) {
  const markup = useMemo(() => wrapRexPlaceholderHtmlForFeed(html), [html]);
  const flat = style && typeof style === 'object' && !Array.isArray(style) ? style : undefined;

  return (
    <div
      className={cn('h-full w-full overflow-hidden', className)}
      style={{ ...(flat as React.CSSProperties), minHeight: '100%', minWidth: '100%' }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
