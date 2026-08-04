import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '~/features/auth/providers';
import { Routes } from '~/shared/config/routes';
import BrandBootLoader from '~/shared/ui/BrandBootLoader';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return <BrandBootLoader />;
  }

  if (!session) {
    return <Redirect href={Routes.Login} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
