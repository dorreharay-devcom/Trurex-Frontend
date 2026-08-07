import React from 'react';
import { View } from 'react-native';
import type { useProfileScreen } from '~/features/profile/hooks/useProfileScreen';
import CurrentlySection from '~/features/profile/ui/CurrentlySection';
import ProfileHeader from '~/features/profile/ui/ProfileHeader';
import ProfileTabs from '~/features/profile/ui/ProfileTabs';

type Flow = ReturnType<typeof useProfileScreen>;

type Props = {
  flow: Flow;
  avatarRefreshKey: number;
};

function ProfileBodyChrome({ flow, avatarRefreshKey }: Props) {
  const { profile, content, social, avatar } = flow;

  return (
    <View className="pb-3">
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
    </View>
  );
}

export default ProfileBodyChrome;
