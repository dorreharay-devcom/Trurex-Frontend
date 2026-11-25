import { useAuth } from '~/features/auth/providers';
import { useAccountMode } from '~/features/business-account/hooks/useAccountMode';
import { useNotificationsRealtime } from '~/shared/hooks/useNotificationsRealtime';

function NotificationsRealtimeBridge() {
  const { mfaPending, booting } = useAuth();
  const { activeProfileId } = useAccountMode();
  useNotificationsRealtime(!booting && !mfaPending ? activeProfileId : null);
  return null;
}

export default NotificationsRealtimeBridge;
