import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '~/features/auth/providers';
import { Routes } from '~/shared/config/routes';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, booting } = useAuth();

  if (booting) return null;

  if (!session) {
    return <Redirect href={Routes.Login} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
