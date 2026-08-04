import { isAndroid, isIos } from '~/shared/lib/ui/platform';

export const modalConfig = {
  timing: {
    stepEnterMs: 340,
    stepExitMs: 260,
    sheetOpenMs: 320,
    sheetCloseMs: 280,
  },
  layout: {
    backdropBackground: 'rgba(245, 245, 245, 0.8)' as const,
    minSafeBottom: 16,
  },
} as const;

export const OVERLAY_MODAL_PLATFORM_PROPS = {
  presentationStyle: isIos ? ('overFullScreen' as const) : undefined,
  statusBarTranslucent: isAndroid,
} as const;
