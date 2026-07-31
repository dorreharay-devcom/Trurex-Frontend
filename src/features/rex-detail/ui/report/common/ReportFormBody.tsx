import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import type { ContentReportFlow } from '~/features/rex-detail/hooks/report/useContentReportFlow';
import ReasonRadioGroup from './ReasonRadioGroup';
import ReportDetailsField from './ReportDetailsField';

const SUBTEXT = "Help us keep TruRex trustworthy. What's the issue?";

type Props = {
  flow: ContentReportFlow;
  signedIn: boolean;
  onSignedInPrompt: () => void;
};

function ReportFormBody({ flow, signedIn, onSignedInPrompt }: Props) {
  if (!signedIn) {
    return (
      <View className="items-center py-4">
        <Text className="text-center text-sm text-muted-foreground">
          Sign in to report content.
        </Text>
        <Pressable onPress={onSignedInPrompt} className="mt-2 rounded-lg px-2 py-1">
          <Text className="text-sm text-primary">OK</Text>
        </Pressable>
      </View>
    );
  }
  if (flow.reasonsLoading) {
    return (
      <View className="items-center py-8">
        <ActivityIndicator color={Theme.colors.primary} />
        <Text className="mt-2 text-sm text-muted-foreground">Loading reasons…</Text>
      </View>
    );
  }
  if (flow.reasonsError) {
    return (
      <View className="items-center gap-2 py-6">
        <Text className="text-center text-sm text-muted-foreground">
          Could not load report reasons.
        </Text>
        <Pressable onPress={() => void flow.refetchReasons()} className="rounded-lg py-2">
          <Text className="text-sm font-medium text-primary">Retry</Text>
        </Pressable>
      </View>
    );
  }
  if (flow.reasonOptions.length === 0) {
    return (
      <View className="items-center py-6">
        <Text className="text-center text-sm text-muted-foreground">
          No report reasons are available right now. Try again later.
        </Text>
      </View>
    );
  }
  return (
    <>
      <Text className="mb-3 text-sm text-muted-foreground">{SUBTEXT}</Text>
      <ReasonRadioGroup
        options={flow.reasonOptions}
        selected={flow.reason}
        onSelect={flow.setReason}
      />
      <ReportDetailsField
        visible={flow.otherSelected}
        details={flow.details}
        onChangeDetails={flow.setDetails}
      />
    </>
  );
}

export default ReportFormBody;
