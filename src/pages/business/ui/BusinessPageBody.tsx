import React from 'react';
import { ActivityIndicator, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { OverlayModal } from '~/shared/ui/overlay/OverlayModal';
import { useOverlaySheetPresentation } from '~/shared/hooks/useOverlaySheetPresentation';
import type { BusinessPageState } from '~/pages/business/hooks/useBusinessPage';
import BusinessPageHeaderBar from '~/features/business/ui/BusinessPageHeaderBar';
import BusinessPageContent from '~/features/business/ui/BusinessPageContent';
import PlaceClaimCta from '~/features/business-account/ui/claim/PlaceClaimCta';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  page: BusinessPageState;
  onBack: () => void;
  onOpenRex: (rexId: string) => void;
};

function BusinessPageBody({ page, onBack, onOpenRex }: Props) {
  const { ref, summary } = page;
  const { height: windowHeight } = useWindowDimensions();
  const { sheetTranslateY, handleClose } = useOverlaySheetPresentation({
    visible: true,
    windowHeight,
    onClose: onBack,
  });

  const content = (() => {
    if (!ref || summary.isError) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-foreground">Couldn&apos;t load this business.</Text>
        </View>
      );
    }

    if (summary.isPending || !summary.data?.is_visible_business_page) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      );
    }

    const data = summary.data;

    return (
      <ScrollView
        className="flex-1 w-full"
        contentContainerClassName="w-full px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        <BusinessPageContent
          summary={data}
          page={page}
          onOpenRex={onOpenRex}
          footer={<PlaceClaimCta summary={data} />}
        />
      </ScrollView>
    );
  })();

  return (
    <OverlayModal embedded onRequestClose={handleClose} contentTranslateY={sheetTranslateY}>
      <View className="flex-1 min-h-0 flex-col">
        <BusinessPageHeaderBar onBack={handleClose} />
        {content}
      </View>
    </OverlayModal>
  );
}

export default BusinessPageBody;
