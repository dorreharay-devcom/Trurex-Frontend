import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { CURRENTLY_FIELDS, type CurrentlyFieldKey } from '~/features/profile/config/currently';
import type { CurrentlyData } from '~/features/profile/types/profile';
import { Theme, textFieldCaretStyle, textFieldSingleLineStyle } from '~/shared/theme/Theme';

type Props = {
  currently: CurrentlyData;
  onChangeField: (key: CurrentlyFieldKey, value: string) => void;
};

const EditProfileCurrently = ({ currently, onChangeField }: Props) => (
  <View>
    <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
      Currently...
    </Text>
    <View className="gap-3">
      {CURRENTLY_FIELDS.map((field) => {
        const value = currently[field.key] || '';
        return (
          <View
            key={field.key}
            className="flex-row items-center gap-3 rounded-xl border border-border bg-background p-3"
          >
            <Text className="text-lg">{field.emoji}</Text>
            <View className="min-w-0 flex-1">
              <Text className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                {field.label}
              </Text>
              <TextInput
                value={value}
                onChangeText={(text) => onChangeField(field.key, text)}
                placeholder={`What are you ${field.label.toLowerCase()}?`}
                placeholderTextColor={Theme.colors.muted}
                maxLength={80}
                className="text-sm text-foreground"
                style={[textFieldCaretStyle, textFieldSingleLineStyle, { padding: 0, height: 24 }]}
              />
            </View>
            {value !== '' && (
              <TouchableOpacity
                onPress={() => onChangeField(field.key, '')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel={`Clear ${field.label}`}
                className="p-1"
              >
                <X size={14} color={Theme.colors.muted} />
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  </View>
);

export default EditProfileCurrently;
