import { Platform, type TextStyle } from 'react-native';

export const FontFamily = {
  light: 'HankenGrotesk-Light',
  regular: 'HankenGrotesk-Regular',
  medium: 'HankenGrotesk-Medium',
  semibold: 'HankenGrotesk-SemiBold',
  bold: 'HankenGrotesk-Bold',
  extrabold: 'HankenGrotesk-ExtraBold',
} as const;

export const Brand = {
  color: '#B7C7CF',
  colorDark: '#8FA3AC',
  colorLight: '#E4EBEE',
  colorOnBrand: '#1A2830',
  colorMuted: '#5A7280',
} as const;

export const Colors = {
  primary: Brand.color,
  primaryForeground: Brand.colorOnBrand,
  secondary: '#525252',
  secondaryForeground: '#FAFAFA',
  accent: Brand.colorLight,
  accentForeground: Brand.colorMuted,
  ratingStar: '#F59B0A',

  background: '#F5F5F5',
  card: '#FAFAFA',
  foreground: '#171717',
  muted: '#A1A1A1',
  secondaryText: '#737373',
  border: '#D4D4D4',
  searchFieldBackground: 'hsl(0, 0%, 86%)',

  destructive: '#DB2424',

  sand: '#E4DBCD',
  sandDark: '#3D3529',
  sandMuted: '#9E8F7B',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const textFieldCaretStyle = {
  caretColor: Colors.foreground,
  ...(Platform.OS === 'web' ? null : { fontFamily: FontFamily.regular }),
} as TextStyle;

export const textFieldSingleLineStyle =
  Platform.OS === 'web'
    ? ({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      } as TextStyle)
    : ({
        overflow: 'hidden',
        fontSize: 16,
        lineHeight: 22,
        paddingTop: 0,
        paddingBottom: 0,
        textAlignVertical: 'center',
        includeFontPadding: false,
      } as TextStyle);

export const textFieldSingleLineCompactHeightStyle =
  Platform.OS === 'web' ? null : ({ height: 40 } as TextStyle);

export const textFieldSingleLineDefaultHeightStyle =
  Platform.OS === 'web' ? null : ({ height: 44 } as TextStyle);

export const textFieldSingleLineLargeHeightStyle =
  Platform.OS === 'web' ? null : ({ height: 48 } as TextStyle);

export const textFieldHeaderSearchStyle =
  Platform.OS === 'web'
    ? null
    : ({
        height: 36,
        fontSize: 14,
        lineHeight: 18,
      } as TextStyle);

export const textFieldMultilineStyle =
  Platform.OS === 'web'
    ? null
    : ({
        fontSize: 16,
        lineHeight: 22,
        paddingTop: 10,
        paddingBottom: 10,
        textAlignVertical: 'top',
        includeFontPadding: false,
      } as TextStyle);

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
    width: 176,
    height: 224,
  },
  maxFormWidth: 384,
} as const;

export const Theme = {
  colors: Colors,
  font: FontFamily,
  size: Size,
  brand: Brand,
} as const;
