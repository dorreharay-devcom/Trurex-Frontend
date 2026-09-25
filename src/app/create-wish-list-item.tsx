import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import { takeWishListPrefill } from '~/features/wish-list/lib/wishListPrefillHandoff';
import type { WishListWizardPrefill } from '~/features/wish-list/types/wizardPrefill';
import WishListWizardScreen from '~/features/wish-list/ui/create/WishListWizardScreen';
import { Routes } from '~/shared/config/routes';

function CreateWishListItemPage() {
  const router = useRouter();
  const [prefill, setPrefill] = useState<WishListWizardPrefill | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPrefill(takeWishListPrefill());
    setReady(true);
  }, []);

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace(Routes.Gems);
  };

  if (!ready) return null;

  return <WishListWizardScreen onClose={close} prefill={prefill} />;
}

export default function ProtectedCreateWishListItemPage() {
  return (
    <ProtectedRoute>
      <CreateWishListItemPage />
    </ProtectedRoute>
  );
}
