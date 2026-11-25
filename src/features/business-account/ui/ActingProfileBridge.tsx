import { useActingProfileSync } from '~/features/business-account/hooks/useActingProfileSync';

function ActingProfileBridge() {
  useActingProfileSync();
  return null;
}

export default ActingProfileBridge;
