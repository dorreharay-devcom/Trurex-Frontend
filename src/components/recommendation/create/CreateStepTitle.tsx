import { createElement, type ReactNode } from 'react';
import { Platform, Text } from 'react-native';

type Props = {
  children: ReactNode;
  className?: string;
};

const defaultClassName = 'text-xl font-display font-bold text-foreground text-center';

export function CreateStepTitle({ children, className }: Props) {
  const merged = className ? `${defaultClassName} ${className}` : defaultClassName;
  if (Platform.OS === 'web') {
    return createElement('h3', { className: merged }, children);
  }
  return (
    <Text className={merged} accessibilityRole="header">
      {children}
    </Text>
  );
}
