import { StyleSheet, type TextStyle } from 'react-native';
import { isWeb } from '~/shared/lib/ui/platform';
import { nativeOnly } from '~/shared/lib/ui/styles';

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

const textFieldNative = StyleSheet.create({
  font: {
    fontFamily: FontFamily.regular,
  },
  singleLine: {
    overflow: 'hidden',
    fontSize: 16,
    lineHeight: 22,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  compactHeight: { height: 40 },
  defaultHeight: { height: 44 },
  largeHeight: { height: 48 },
  headerSearch: {
    height: 32,
    fontSize: 14,
    lineHeight: 17,
  },
  singleLineNoWrap: {
    height: 40,
    maxHeight: 40,
    lineHeight: 22,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
  },
  multiline: {
    fontSize: 16,
    lineHeight: 22,
    paddingTop: 10,
    paddingBottom: 10,
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
});

const textFieldWebSingleLine = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as TextStyle;

export const textFieldCaretStyle = {
  caretColor: Colors.foreground,
  ...nativeOnly(textFieldNative.font),
} as TextStyle;

export const textFieldSingleLineStyle = isWeb ? textFieldWebSingleLine : textFieldNative.singleLine;

export const textFieldSingleLineCompactHeightStyle = nativeOnly(textFieldNative.compactHeight);
export const textFieldSingleLineDefaultHeightStyle = nativeOnly(textFieldNative.defaultHeight);
export const textFieldSingleLineLargeHeightStyle = nativeOnly(textFieldNative.largeHeight);
export const textFieldHeaderSearchStyle = nativeOnly(textFieldNative.headerSearch);
export const textFieldNativeSingleLineNoWrapStyle = nativeOnly(textFieldNative.singleLineNoWrap);
export const textFieldMultilineStyle = nativeOnly(textFieldNative.multiline);

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
