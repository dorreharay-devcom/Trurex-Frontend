import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Search, Store } from 'lucide-react-native';
import BusinessPageContent from '~/features/business/ui/BusinessPageContent';
import { MY_BUSINESS_PAGE_STATE } from '~/features/business-account/config/myBusinessPage';
import { useMyBusinessPage } from '~/features/business-account/hooks/useMyBusinessPage';
import BusinessClaimPendingNotice from '~/features/business-account/ui/claim/BusinessClaimPendingNotice';
import BusinessClaimSheet from '~/features/business-account/ui/claim/BusinessClaimSheet';
import BusinessPlaceholder from '~/features/business-account/ui/common/BusinessPlaceholder';
import MyBusinessProfileCard from '~/features/business-account/ui/page/MyBusinessProfileCard';
import { Theme } from '~/shared/theme/Theme';
import { Button, ButtonVariant } from '~/shared/ui/primitives/Button';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';

type PageView = ReturnType<typeof useMyBusinessPage>;

function ApprovedPageBody({ view }: { view: PageView }) {
  const summary = view.page.summary.data;

  if (view.state === MY_BUSINESS_PAGE_STATE.loading) {
    return (
      <View className="items-center py-8">
        <ActivityIndicator color={Theme.colors.muted} />
      </View>
    );
  }
  if (view.state === MY_BUSINESS_PAGE_STATE.error) {
    return <QueryErrorState title="Couldn't load your business page" onRetry={view.retry} />;
  }
  if (view.state === MY_BUSINESS_PAGE_STATE.page && summary) {
    return (
      <BusinessPageContent
        summary={summary}
        page={view.page}
        onOpenRex={view.openRex}
        headerAction={
          <Button
            title="Edit Public Page"
            variant={ButtonVariant.Secondary}
            onPress={view.openEdit}
          />
        }
      />
    );
  }
  return (
    <>
      <MyBusinessProfileCard profile={view.profile} onEdit={view.openEdit} />
      <BusinessPlaceholder
        icon={<Store size={22} color={Theme.colors.accentForeground} />}
        title="Linking your place"
        message="Your business page appears here once your business is linked to its place."
      />
    </>
  );
}

function PageBody({ view }: { view: PageView }) {
  if (view.state === MY_BUSINESS_PAGE_STATE.notClaimed) {
    return (
      <BusinessPlaceholder
        icon={<Search size={22} color={Theme.colors.accentForeground} />}
        title="No business claimed yet"
        message="Find your business, claim it, and get verified to manage its page."
        actionLabel="Find my business"
        onAction={() => view.claim.start()}
      />
    );
  }
  if (view.state === MY_BUSINESS_PAGE_STATE.pending) {
    return <BusinessClaimPendingNotice />;
  }
  return <ApprovedPageBody view={view} />;
}

function MyBusinessPage() {
  const view = useMyBusinessPage();

  return (
    <View className="gap-6 pt-4">
      <PageBody view={view} />
      <BusinessClaimSheet flow={view.claim} />
    </View>
  );
}

export default MyBusinessPage;
