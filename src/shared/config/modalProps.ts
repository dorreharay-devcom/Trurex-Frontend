import { isAndroid, isIos } from '~/utils';

export const OVERLAY_MODAL_PLATFORM_PROPS = {
  presentationStyle: isIos ? ('overFullScreen' as const) : undefined,
  statusBarTranslucent: isAndroid,
} as const;
