import React from 'react';
import { View, Text, Image } from 'react-native';

const logoSource = require('../../../../../assets/truRexLogo.png');

type Props = {
  title?: string;
  subtitle?: string;
};

const AuthBrandHeader = ({ title, subtitle }: Props) => {
  const hasCopy = Boolean(title || subtitle);

  return (
    <View className="items-center gap-4">
      <Image source={logoSource} style={{ height: 40, resizeMode: 'contain' }} />

      {hasCopy && (
        <View className="items-center gap-1">
          {title && <Text className="text-lg font-semibold text-foreground">{title}</Text>}
          {subtitle && (
            <Text className="text-center text-sm text-muted-foreground">{subtitle}</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default AuthBrandHeader;
