import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/shared/theme/Theme';
import { webNoOutline } from '~/shared/lib/ui/styles';
import { MAX_THANK_MESSAGE_LENGTH } from '~/features/rex-detail/config/thank';

type Props = {
  message: string;
  onChangeMessage: (message: string) => void;
};

function ThankMessageCustomField({ message, onChangeMessage }: Props) {
  return (
    <View className="mb-3">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Or write your own
      </Text>
      <TextInput
        placeholder="Write a custom thank you message (optional)"
        placeholderTextColor={Theme.colors.secondaryText}
        value={message}
        onChangeText={onChangeMessage}
        maxLength={MAX_THANK_MESSAGE_LENGTH}
        multiline
        numberOfLines={3}
        className="min-h-[80px] rounded-[12px] border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground"
        style={[textFieldCaretStyle, textFieldMultilineStyle, webNoOutline]}
      />
      <Text className="text-right text-[10px] text-muted-foreground">
        {message.length}/{MAX_THANK_MESSAGE_LENGTH}
      </Text>
    </View>
  );
}

export default ThankMessageCustomField;
