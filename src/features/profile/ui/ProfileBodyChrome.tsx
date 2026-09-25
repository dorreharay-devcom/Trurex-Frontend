import React from 'react';
import { View } from 'react-native';
import type { useProfileScreen } from '~/features/profile/hooks/useProfileScreen';
import CurrentlySection from '~/features/profile/ui/CurrentlySection';
import ProfileHeader from '~/features/profile/ui/ProfileHeader';
import ProfileReferralsSection from '~/features/profile/ui/ProfileReferralsSection';
import ProfileTabs from '~/features/profile/ui/ProfileTabs';
import ProfileWishListSection from '~/features/wish-list/ui/profile-section/ProfileWishListSection';

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

      {flow.isOwnProfile ? <ProfileReferralsSection onPress={flow.openReferrals} /> : null}

      {profile?.currently ? <CurrentlySection currently={profile.currently} /> : null}

      {profile ? (
        <ProfileWishListSection
          profile={profile}
          isOwnProfile={flow.isOwnProfile}
          onOpenWishList={flow.openWishList}
        />
      ) : null}

      <ProfileTabs
        activeTab={content.activeTab}
        onChange={content.setActiveTab}
        rexCount={content.rexTabCount}
        collectionsCount={content.collectionsTabCount}
        rexRequestsCount={content.rexRequestsTabCount}
      />
    </View>
  );
}

export default ProfileBodyChrome;
