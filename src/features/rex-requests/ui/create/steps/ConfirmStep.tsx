import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '~/features/auth/providers';
import { ProfileApi } from '~/features/profile/api/profileApi';
import {
  authorForConfirmPreview,
  getConfirmCircleTitles,
} from '~/features/rex-create/lib/confirmPreview';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import CreateStepTitle from '~/features/rex-create/ui/CreateStepTitle';
import { categoryRowToPickerTile } from '~/features/rex-create/lib/categories';
import { useMyCircles } from '~/features/circles/hooks/data/useMyCircles';
import { mapApiCirclesToDisplayRows } from '~/features/circles/lib/display';
import { needByLabel as needByLabelFor } from '~/features/rex-requests/config/needBy';
import type { CreateRexRequestFlow } from '~/features/rex-requests/hooks/create/useCreateRexRequestWizard';
import ConfirmPreviewCard from './common/ConfirmPreviewCard';

const DYNO_IMAGE_SOURCE = require('@assets/dyno.svg');

type Props = {
  flow: CreateRexRequestFlow;
};

function ConfirmStep({ flow }: Props) {
  const { user } = useAuth();
  const { data: meProfile } = useQuery({
    queryKey: ['getUserProfile', 'confirmPreview', user?.id],
    queryFn: () => ProfileApi.getProfile({ userId: user!.id }),
    enabled: !!user?.id,
  });
  const author = useMemo(
    () => authorForConfirmPreview(user, meProfile ?? undefined),
    [user, meProfile],
  );

  const { data: apiCircles } = useMyCircles(true);
  const circleTitleLookup = useMemo(
    () =>
      apiCircles?.length
        ? mapApiCirclesToDisplayRows(apiCircles).map((c) => ({ id: c.id, title: c.title }))
        : [],
    [apiCircles],
  );

  const categoryTiles = useMemo(
    () => flow.category.selectedRows.map(categoryRowToPickerTile),
    [flow.category.selectedRows],
  );

  const sharingLabel = useMemo(() => {
    if (flow.circles.isPublic) return 'Public';
    const titles = getConfirmCircleTitles(flow.circles.selectedCircleIds, circleTitleLookup);
    return titles.length > 0 ? titles.join(', ') : 'No one yet';
  }, [flow.circles.isPublic, flow.circles.selectedCircleIds, circleTitleLookup]);

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={`${CREATE_REC_STEP_INNER} gap-6`}>
        <View className="items-center gap-2">
          <View className="flex-row items-center justify-center gap-2">
            <CreateStepTitle>Looking good!</CreateStepTitle>
            <Image
              source={DYNO_IMAGE_SOURCE}
              style={{ width: 26, height: 26 }}
              contentFit="contain"
              accessibilityLabel="TruRex dinosaur"
            />
          </View>
          <Text className="text-center text-sm text-muted-foreground">
            Here&apos;s how your request will appear
          </Text>
        </View>

        <ConfirmPreviewCard
          author={author}
          categories={categoryTiles}
          lookingForText={flow.details.lookingForText}
          locationText={flow.details.locationQuery || null}
          needByLabel={flow.needByNote.needBy ? needByLabelFor(flow.needByNote.needBy) : '—'}
          note={flow.needByNote.note}
          sharingLabel={sharingLabel}
        />
      </View>
    </ScrollView>
  );
}

export default ConfirmStep;
