import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '~/features/auth/providers';
import { Routes } from '~/shared/config/routes';
import { Theme } from '~/shared/theme/Theme';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 bg-[#F5F5F5] items-center justify-center">
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href={Routes.Login} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
