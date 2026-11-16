import React from 'react';
import { View } from 'react-native';
import AccountModeSwitcher from '~/features/business-account/ui/AccountModeSwitcher';
import BusinessClaimProfileEntry from '~/features/business-account/ui/claim/BusinessClaimProfileEntry';
import BusinessProfileViewTabs from '~/features/business-account/ui/profile/BusinessProfileViewTabs';
import type { useProfileScreen } from '~/features/profile/hooks/useProfileScreen';
import CurrentlySection from '~/features/profile/ui/CurrentlySection';
import ProfileHeader from '~/features/profile/ui/ProfileHeader';
import ProfileReferralsSection from '~/features/profile/ui/ProfileReferralsSection';
import ProfileTabs from '~/features/profile/ui/ProfileTabs';
import ProfileVerifySection from '~/features/profile/ui/ProfileVerifySection';
import ProfileWishListSection from '~/features/wish-list/ui/profile-section/ProfileWishListSection';
import { TEMPORARY_ENABLE_IDENTITY_VERIFICATION } from '~/shared/config/featureFlags';

type Flow = ReturnType<typeof useProfileScreen>;

type Props = {
  flow: Flow;
  avatarRefreshKey: number;
};

function ProfileBodyChrome({ flow, avatarRefreshKey }: Props) {
  const { profile, headerProfile, content, social, avatar, business } = flow;

  return (
    <View className="pb-3">
      {headerProfile ? (
        <ProfileHeader
          profile={headerProfile}
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
          onVerifyIdentity={
            business.businessFace || !TEMPORARY_ENABLE_IDENTITY_VERIFICATION
              ? undefined
              : flow.openVerifyIdentity
          }
          avatarEditable={flow.isOwnProfile && !business.businessFace}
          accessory={
            business.canSwitch ? (
              <AccountModeSwitcher mode={business.mode} onChange={business.setMode} />
            ) : null
          }
        />
      ) : null}

      {TEMPORARY_ENABLE_IDENTITY_VERIFICATION && flow.isOwnProfile && profile && !profile.verified ? (
        <ProfileVerifySection onPress={flow.openVerifyIdentity} />
      ) : null}

      {flow.isOwnProfile && !business.showMyBusinessPage ? <BusinessClaimProfileEntry /> : null}

      {flow.isOwnProfile ? <ProfileReferralsSection onPress={flow.openReferrals} /> : null}

      {business.active ? (
        <BusinessProfileViewTabs view={business.view} onChange={business.setView} />
      ) : null}

      {profile && business.showContentTabs ? (
        <ProfileWishListSection
          profile={profile}
          isOwnProfile={flow.isOwnProfile}
          onOpenWishList={flow.openWishList}
        />
      ) : null}

      {profile?.currently && business.showContentTabs ? (
        <CurrentlySection currently={profile.currently} />
      ) : null}

      {business.showContentTabs ? (
        <ProfileTabs
          activeTab={content.activeTab}
          onChange={content.setActiveTab}
          rexCount={content.rexTabCount}
          collectionsCount={content.collectionsTabCount}
          rexRequestsCount={content.rexRequestsTabCount}
        />
      ) : null}
    </View>
  );
}

export default ProfileBodyChrome;
