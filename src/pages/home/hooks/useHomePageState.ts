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

  const { close: closePreview } = preview;
  const { openUserProfile: openProfileTab } = tabs;
  const { openWithPrefill, openForEdit } = create;

  const bumpAvatarRefresh = useCallback(() => setAvatarRefreshKey((k) => k + 1), []);

  const openUserProfile = useCallback(
    (userId: string) => {
      closePreview();
      openProfileTab(userId);
    },
    [closePreview, openProfileTab],
  );

  const addYourOwn = useCallback(
    (source: AddYourOwnRecSource) => {
      closePreview();
      openWithPrefill(source);
    },
    [closePreview, openWithPrefill],
  );

  const editRex = useCallback(
    (rexId: string) => {
      closePreview();
      openForEdit(rexId);
    },
    [closePreview, openForEdit],
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
