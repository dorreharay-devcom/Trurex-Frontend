import { vi } from 'vitest';

vi.mock('react-native', () => {
  const Platform = {
    OS: 'ios',
    select: <T>(spec: { ios?: T; android?: T; default?: T; native?: T; web?: T }) =>
      spec.ios ?? spec.native ?? spec.default,
  };
  return {
    Platform,
    StyleSheet: {
      create: <T>(styles: T) => styles,
      hairlineWidth: 1,
      flatten: (s: unknown) => s,
      absoluteFillObject: {},
    },
    AppState: {
      addEventListener: () => ({ remove: () => {} }),
      currentState: 'active',
    },
    Dimensions: {
      get: () => ({ width: 390, height: 844, scale: 2, fontScale: 1 }),
    },
    PixelRatio: { get: () => 2, roundToNearestPixel: (n: number) => n },
    Share: { share: vi.fn() },
    Alert: { alert: vi.fn() },
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    Pressable: 'Pressable',
    Modal: 'Modal',
    ActivityIndicator: 'ActivityIndicator',
  };
});

vi.mock('react-native-toast-message', () => ({
  default: { show: vi.fn(), hide: vi.fn() },
}));

vi.mock('~/shared/api/client', () => ({
  Backend: {
    from: vi.fn(),
    auth: {},
    removeChannel: vi.fn(),
    channel: vi.fn(),
  },
  unwrap: <T>(value: T) => value,
  Auth: {},
}));
