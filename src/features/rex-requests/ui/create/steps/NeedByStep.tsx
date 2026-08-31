import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/shared/theme/Theme';
import { webNoOutline } from '~/shared/lib/ui/styles';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import { CREATE_REC_REVIEW_MAX } from '~/features/rex-create/config/scorecard';
import { NEED_BY_OPTIONS } from '~/features/rex-requests/config/needBy';
import type { CreateRexRequestFlow } from '~/features/rex-requests/hooks/create/useCreateRexRequestWizard';
import ReasonRadioGroup from '~/features/rex-detail/ui/report/common/ReasonRadioGroup';

type Props = {
  flow: CreateRexRequestFlow;
};

function NeedByStep({ flow }: Props) {
  const { needBy, setNeedBy, note, setNote } = flow.needByNote;

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-24"
    >
      <View className={CREATE_REC_STEP_INNER}>
        <View className="mb-3 flex-row flex-wrap items-center gap-x-2 gap-y-1">
          <Text className="text-xs font-medium uppercase tracking-wider text-black">Need by</Text>
        </View>
        <View className="rounded-xl border border-border p-4">
          <ReasonRadioGroup
            options={NEED_BY_OPTIONS.map((option) => ({ value: option.id, label: option.label }))}
            selected={needBy}
            onSelect={(value) => setNeedBy(value as (typeof NEED_BY_OPTIONS)[number]['id'])}
          />
        </View>

        <View className="mb-2 mt-4 flex-row flex-wrap items-center gap-x-2 gap-y-1">
          <Text className="text-xs font-medium uppercase tracking-wider text-black">
            Additional details
          </Text>
          <Text className="text-[10px] italic text-black opacity-80">optional</Text>
        </View>
        <TextInput
          placeholder="Any extra context that could help..."
          placeholderTextColor={Theme.colors.secondaryText}
          value={note}
          onChangeText={setNote}
          maxLength={CREATE_REC_REVIEW_MAX}
          multiline
          numberOfLines={3}
          className="min-h-[80px] rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground"
          style={[textFieldCaretStyle, textFieldMultilineStyle, webNoOutline]}
        />
      </View>
    </ScrollView>
  );
}

export default NeedByStep;
