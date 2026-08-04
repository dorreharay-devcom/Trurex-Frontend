import React from 'react';
import { useOAuthCallback } from '~/features/auth/hooks/useOAuthCallback';
import BrandBootLoader from '~/shared/ui/BrandBootLoader';

function AuthCallbackPage() {
  useOAuthCallback();
  return <BrandBootLoader />;
}

export default AuthCallbackPage;
