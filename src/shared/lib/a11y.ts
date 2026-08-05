import type { AccessibilityProps } from 'react-native';

export function buttonA11y(
  label: string,
  options?: { disabled?: boolean; selected?: boolean; hint?: string },
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: label,
    accessibilityState: {
      disabled: options?.disabled === true,
      selected: options?.selected === true,
    },
    ...(options?.hint ? { accessibilityHint: options.hint } : null),
  };
}

export function tabA11y(label: string, selected: boolean): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: 'tab',
    accessibilityLabel: label,
    accessibilityState: { selected },
  };
}

export function headerA11y(label: string): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: 'header',
    accessibilityLabel: label,
  };
}

export function liveRegionA11y(label: string): AccessibilityProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityLiveRegion: 'polite',
  };
}
