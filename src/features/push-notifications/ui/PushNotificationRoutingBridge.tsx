import { usePushNotificationRouting } from '~/features/push-notifications/hooks/usePushNotificationRouting';

function PushNotificationRoutingBridge() {
  usePushNotificationRouting();
  return null;
}

export default PushNotificationRoutingBridge;
