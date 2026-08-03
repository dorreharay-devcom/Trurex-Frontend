import React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { PROFILE_TAB } from '~/features/profile/config/tabs';
import type { useProfileScreen } from '~/features/profile/hooks/useProfileScreen';
import CurrentlySection from '~/features/profile/ui/CurrentlySection';
import ProfileBackButton from '~/features/profile/ui/ProfileBackButton';
import ProfileHeader from '~/features/profile/ui/ProfileHeader';
import ProfileTabs from '~/features/profile/ui/ProfileTabs';
import ProfileCollectionsGrid from '~/features/profile/ui/collections/ProfileCollectionsGrid';
import ProfileRexGrid from '~/features/profile/ui/rex-grid/ProfileRexGrid';
import { webContainerStyle } from '~/shared/lib/ui/styles';

type Flow = ReturnType<typeof useProfileScreen>;

type Props = {
  flow: Flow;
  avatarRefreshKey: number;
  onBack?: () => void;
};

function profileGridCellWidth(windowWidth: number): number {
  const gridWidth = Math.min(windowWidth, 1280) - 66;
  const numCols = gridWidth < 700 ? 2 : 4;
  return Math.floor((gridWidth - 12 * (numCols - 1)) / numCols);
}

const ProfileMainBody = ({ flow, avatarRefreshKey, onBack }: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const cellWidth = profileGridCellWidth(windowWidth);
  const { content, social, collectionOverlay, profile, avatar } = flow;

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={webContainerStyle}
      contentContainerClassName="p-4"
      onScroll={content.loadMoreOnScroll}
      scrollEventThrottle={16}
    >
      {onBack ? <ProfileBackButton onPress={onBack} className="mb-3" /> : null}

      <View className="rounded-xl border border-border bg-card shadow-card">
        {profile ? (
          <ProfileHeader
            profile={profile}
            isOwnProfile={flow.isOwnProfile}
            onEditProfile={flow.openEdit}
            onSignOut={flow.signOut}
            onAvatarPress={avatar.handleAvatarPress}
            avatarUploading={avatar.avatarUploading}
            avatarRefreshKey={avatarRefreshKey}
            onFollow={social.onFollow}
            onUnfollow={social.onUnfollow}
            followLoading={social.followLoading}
            isBlocked={social.isBlocked}
            onBlockPress={social.openBlockConfirm}
            onUnblockPress={social.onUnblock}
            blockLoading={social.blockPending}
          />
        ) : null}

        {profile?.currently ? <CurrentlySection currently={profile.currently} /> : null}

        <ProfileTabs
          activeTab={content.activeTab}
          onChange={content.setActiveTab}
          rexCount={content.rexTabCount}
          collectionsCount={content.collectionsTabCount}
        />

        <View className="pb-4">
          {content.activeTab === PROFILE_TAB.recs ? (
            <ProfileRexGrid
              loading={content.rexesLoading}
              rows={content.myRexes}
              cellWidth={cellWidth}
              fetchingMore={content.isFetchingNextRexesPage}
              onPressRex={flow.onRexPress}
            />
          ) : null}

          {content.activeTab === PROFILE_TAB.collections ? (
            <ProfileCollectionsGrid
              loading={content.collectionsLoading}
              rows={content.myCollections}
              cellWidth={cellWidth}
              fetchingMore={content.isFetchingNextCollectionsPage}
              onOpenCollection={collectionOverlay.openCollection}
            />
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileMainBody;
