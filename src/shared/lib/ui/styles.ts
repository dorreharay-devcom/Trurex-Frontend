import { clsx, type ClassValue } from 'clsx';
import type { TextStyle, StyleProp, ViewStyle } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { isAndroid, isWeb } from '~/shared/lib/ui/platform';

export type { ClassValue };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const flexRowSingleLineText: TextStyle = {
  flex: 1,
  minWidth: 0,
};

export const singleLineEllipsisTextStyle: TextStyle = isWeb
  ? ({
      ...flexRowSingleLineText,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '100%',
    } as TextStyle)
  : flexRowSingleLineText;

export const WEB_CONTENT_MAX_WIDTH = 1280;

const WEB_CONTENT_COLUMN: ViewStyle = {
  maxWidth: WEB_CONTENT_MAX_WIDTH,
  width: '100%',
  alignSelf: 'center',
};

export const webContainerStyle: ViewStyle | undefined = isWeb ? WEB_CONTENT_COLUMN : undefined;

export function withWebContainer(
  ...styles: Array<StyleProp<ViewStyle> | undefined | false | null>
): StyleProp<ViewStyle> {
  return [...styles.filter(Boolean), webContainerStyle] as StyleProp<ViewStyle>;
}

export const webNoOutline = isWeb ? ({ outlineStyle: 'none' } as object) : undefined;

const notAllowedCursorStyle = { cursor: 'not-allowed' } as unknown as ViewStyle;

export function webDisabledCursor(disabled: boolean): ViewStyle | undefined {
  if (!disabled || !isWeb) return undefined;
  return notAllowedCursorStyle;
}

export function androidElevation(value: number): ViewStyle | undefined {
  if (!isAndroid) return undefined;
  return { elevation: value };
}

export function nativeOnly<T extends object>(style: T): T | undefined {
  if (isWeb) return undefined;
  return style;
}

export function webOnly<T extends object>(style: T): T | undefined {
  if (!isWeb) return undefined;
  return style;
}
