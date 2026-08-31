type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

type AnalyticsSink = (event: string, props?: AnalyticsProps) => void;

let sink: AnalyticsSink | null = null;

export function setAnalyticsSink(next: AnalyticsSink | null): void {
  sink = next;
}

export function track(event: string, props?: AnalyticsProps): void {
  try {
    sink?.(event, props);
    if (__DEV__) {
      console.info('[analytics]', event, props ?? {});
    }
  } catch {}
}

export const AnalyticsEvent = {
  AppOpened: 'app_opened',
  AuthSignedIn: 'auth_signed_in',
  AuthSignedOut: 'auth_signed_out',
  RexCreated: 'rex_created',
  RexLiked: 'rex_liked',
  RexThanked: 'rex_thanked',
  RexRequestCreated: 'rex_request_created',
  PushTokenRegistered: 'push_token_registered',
  PushNotificationTapped: 'push_notification_tapped',
  ScreenError: 'screen_error',
  OfflineBlockedMutation: 'offline_blocked_mutation',
} as const;
