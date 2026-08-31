import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CreateRexRequestScreen from '~/features/rex-requests/ui/create/CreateRexRequestScreen';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import { Routes } from '~/shared/config/routes';
import { parseOptionalRouteId } from '~/shared/lib/navigation/routeIds';

function CreateRexRequestPage() {
  const router = useRouter();
  const raw = useLocalSearchParams<{ edit?: string | string[] }>();
  const editRequestId = parseOptionalRouteId(raw.edit);

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace(Routes.Main);
  };

  return <CreateRexRequestScreen onClose={close} editRequestId={editRequestId} />;
}

export default function ProtectedCreateRexRequestPage() {
  return (
    <ProtectedRoute>
      <CreateRexRequestPage />
    </ProtectedRoute>
  );
}
