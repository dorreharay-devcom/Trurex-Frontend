import React, { ReactNode } from 'react';
import { View, ScrollView } from 'react-native';
import { isWeb } from '~/utils';

interface ContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  scrollable = true,
  className = '',
}) => {
  const content = (
    <View
      className={`
        p-4 self-center w-full
        ${isWeb ? 'max-w-[1200px]' : ''}
      `}
    >
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView contentContainerClassName="flex-grow" className={`flex-1 bg-white ${className}`}>
        {content}
      </ScrollView>
    );
  }

  return <View className={`flex-1 bg-white ${className}`}>{content}</View>;
};
