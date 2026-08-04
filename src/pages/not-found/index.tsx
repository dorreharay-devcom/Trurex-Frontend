import React from 'react';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Routes } from '~/shared/config/routes';

function NotFoundPage() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
      <Text className="text-lg font-semibold text-foreground">This page doesn't exist.</Text>
      <Link href={Routes.Main} className="rounded-lg bg-primary px-4 py-2">
        <Text className="font-semibold text-white">Go to Discover</Text>
      </Link>
    </View>
  );
}

export default NotFoundPage;
