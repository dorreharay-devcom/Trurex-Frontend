import { createElement, type ReactNode } from 'react';
import { Text } from 'react-native';
import { isWeb } from '~/shared/lib/ui/platform';

type Props = {
  children: ReactNode;
  className?: string;
};

const defaultClassName = 'text-xl font-display font-bold text-foreground text-center';

function CreateStepTitle({ children, className }: Props) {
  const merged = className ? `${defaultClassName} ${className}` : defaultClassName;
  if (isWeb) {
    return createElement('h3', { className: merged }, children);
  }
  return (
    <Text className={merged} accessibilityRole="header">
      {children}
    </Text>
  );
}

export default CreateStepTitle;
