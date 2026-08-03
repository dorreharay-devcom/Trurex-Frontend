import React from 'react';
import { Image } from 'react-native';

const LOGO = require('@assets/truRexLogo.png');

const HeaderLogo = () => (
  <Image
    source={LOGO}
    style={{ width: 80, height: 28 }}
    resizeMode="contain"
    accessibilityIgnoresInvertColors
  />
);

export default HeaderLogo;
