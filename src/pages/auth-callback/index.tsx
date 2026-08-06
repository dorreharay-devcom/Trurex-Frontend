import { useOAuthCallback } from '~/features/auth/hooks/useOAuthCallback';

function AuthCallbackPage() {
  useOAuthCallback();
  return null;
}

export default AuthCallbackPage;
