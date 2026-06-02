import { clsx, type ClassValue } from 'clsx';
import type { ViewStyle } from 'react-native';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const webDisabledCursorStyle = { cursor: 'not-allowed' } as unknown as ViewStyle;

export type { ClassValue };
