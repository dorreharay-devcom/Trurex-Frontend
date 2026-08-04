import { useCallback, useState } from 'react';
import type { AddYourOwnRecSource } from '~/features/rex-create';
import type { RexPreviewState } from '~/features/rex-detail/hooks/useRexPreview';
import type { CreateRexModalState } from '~/pages/home/hooks/useCreateRexModal';
import type { HomeTabsState } from '~/pages/home/hooks/useHomeTabs';

type Args = {
  tabs: HomeTabsState;
  create: CreateRexModalState;
  preview: RexPreviewState;
};

export function useHomePageState({ tabs, create, preview }: Args) {
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);
  const [mapRexSheetOpen, setMapRexSheetOpen] = useState(false);

  const bumpAvatarRefresh = useCallback(() => setAvatarRefreshKey((k) => k + 1), []);

  const openUserProfile = useCallback(
    (userId: string) => {
      preview.close();
      tabs.openUserProfile(userId);
    },
    [preview.close, tabs.openUserProfile],
  );

  const addYourOwn = useCallback(
    (source: AddYourOwnRecSource) => {
      preview.close();
      create.openWithPrefill(source);
    },
    [preview.close, create.openWithPrefill],
  );

  const editRex = useCallback(
    (rexId: string) => {
      preview.close();
      create.openForEdit(rexId);
    },
    [preview.close, create.openForEdit],
  );

  return {
    searchQuery,
    setSearchQuery,
    avatarRefreshKey,
    bumpAvatarRefresh,
    mapRexSheetOpen,
    setMapRexSheetOpen,
    openUserProfile,
    addYourOwn,
    editRex,
  };
}
