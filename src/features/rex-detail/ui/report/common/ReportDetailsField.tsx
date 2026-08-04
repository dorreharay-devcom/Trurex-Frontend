import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/shared/theme/Theme';
import { webNoOutline } from '~/shared/lib/ui/styles';
import { MAX_CONTENT_REPORT_DETAILS } from '~/features/rex-detail/config/contentReport';

type Props = {
  visible: boolean;
  details: string;
  onChangeDetails: (details: string) => void;
};

function ReportDetailsField({ visible, details, onChangeDetails }: Props) {
  if (!visible) return null;
  return (
    <View className="mb-3">
      <TextInput
        placeholder="Describe the issue (required)"
        placeholderTextColor={Theme.colors.secondaryText}
        value={details}
        onChangeText={onChangeDetails}
        maxLength={MAX_CONTENT_REPORT_DETAILS}
        multiline
        numberOfLines={3}
        className="min-h-[80px] rounded-[12px] border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground"
        style={[textFieldCaretStyle, textFieldMultilineStyle, webNoOutline]}
      />
      <Text className="text-right text-[10px] text-muted-foreground">
        {details.length}/{MAX_CONTENT_REPORT_DETAILS}
      </Text>
    </View>
  );
}

export default ReportDetailsField;
