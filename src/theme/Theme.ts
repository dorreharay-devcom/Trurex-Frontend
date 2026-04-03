

export const FontFamily = {
  light:    'HankenGrotesk_300Light',
  regular:  'HankenGrotesk_400Regular',
  medium:   'HankenGrotesk_500Medium',
  semibold: 'HankenGrotesk_600SemiBold',
  bold:     'HankenGrotesk_700Bold',
  extrabold:'HankenGrotesk_800ExtraBold',
} as const;

export const Colors = {
  primary:             '#E9560C',
  primaryForeground:   '#FFF4EB',
  secondary:           '#525252',
  secondaryForeground: '#FAFAFA',
  accent:              '#FFFBEB',
  accentForeground:    '#F59B0A',
  
  background:          '#F5F5F5',
  foreground:          '#171717',
  muted:               '#A1A1A1',
  secondaryText:       '#737373',
  border:              '#D4D4D4',
  
  destructive:         '#DB2424',
  
  sand:                '#E4DBCD',
  sandDark:            '#3D3529',
  sandMuted:           '#9E8F7B',

  white:               '#FFFFFF',
  black:               '#000000',
  transparent:         'transparent',
} as const;

export const Size = {
  icon: {
    sm: 14, 
    md: 18, 
    lg: 24,  
  },
  logo: {
    height: 40,
  },
  collectionCard: {
    width:  176,
    height: 224,
  },
  maxFormWidth: 384,
} as const;

export const Theme = {
  colors:     Colors,
  font:       FontFamily,
  size:       Size,
} as const;
