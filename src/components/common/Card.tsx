import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <View
      className={`
        bg-white rounded-2xl p-6 my-2
        shadow-lg shadow-black/10
        border border-gray-100
        ${className ?? ''}
      `}
    >
      {children}
    </View>
  );
};
