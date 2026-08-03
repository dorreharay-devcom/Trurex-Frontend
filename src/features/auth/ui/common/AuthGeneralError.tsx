import React from 'react';
import { Text } from 'react-native';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  message: string | null | undefined;
  className?: string;
};

const AuthGeneralError = ({ message, className }: Props) => {
  if (!message) return null;

  return <Text className={cn('text-xs text-destructive text-center', className)}>{message}</Text>;
};

export default AuthGeneralError;
