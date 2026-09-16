/**
 * Treat only a definite "not connected" as offline.
 * Do not use NetInfo's `isInternetReachable` — on iOS/Android it often stays
 * `false` for a while after resume even when the device is online.
 * @see https://github.com/react-native-netinfo/react-native-netinfo/issues/326
 */
export function isOnlineState(state: { isConnected: boolean | null }): boolean {
  return state.isConnected !== false;
}
