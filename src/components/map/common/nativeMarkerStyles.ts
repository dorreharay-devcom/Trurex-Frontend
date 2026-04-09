import { StyleSheet } from 'react-native';
import { Theme } from '~/theme/Theme';

export const nativeMarkerStyles = StyleSheet.create({
  markerHit: {
    alignItems: 'center',
  },
  tooltipImage: {
    width: 300,
    height: 118,
    borderRadius: 12,
    marginTop: 0,
    backgroundColor: Theme.colors.border,
  },
  tooltip: {
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    maxWidth: 320,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    gap: 6,
  },
  tooltipTextBlock: {
    gap: 2,
    minWidth: 0,
    marginBottom: 0,
  },
  tooltipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.foreground,
  },
  tooltipSub: {
    fontSize: 12,
    marginTop: 0,
    color: Theme.colors.secondaryText,
  },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
