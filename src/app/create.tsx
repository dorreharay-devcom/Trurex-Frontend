import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CreateScreen } from '~/features/rex-create';
import type { AddYourOwnRecSource } from '~/features/rex-create';
import { takeCreatePrefill } from '~/features/rex-create/lib/createPrefillHandoff';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import { Routes } from '~/shared/config/routes';
import { parseOptionalRouteId } from '~/shared/lib/navigation/routeIds';

function CreatePage() {
  const router = useRouter();
  const raw = useLocalSearchParams<{ edit?: string | string[] }>();
  const editRexId = parseOptionalRouteId(raw.edit);
  const [prefill, setPrefill] = useState<AddYourOwnRecSource | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPrefill(takeCreatePrefill());
    setReady(true);
  }, []);

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace(Routes.Main);
  };

  if (!ready) return null;

  return <CreateScreen onClose={close} addYourOwnPrefill={prefill} editRexId={editRexId} />;
}

export default function ProtectedCreatePage() {
  return (
    <ProtectedRoute>
      <CreatePage />
    </ProtectedRoute>
  );
}
