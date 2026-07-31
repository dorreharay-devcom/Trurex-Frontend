import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { X } from 'lucide-react-native';
import {
  Theme,
  textFieldCaretStyle,
  textFieldMultilineStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { CIRCLE_COLOR_PRESETS, type CirclePresetColor } from '~/shared/config/circles';
import { KEYBOARD_BEHAVIOR_IOS_PADDING } from '~/shared/config/keyboard';
import { isWeb, webDisabledCursor, webNoOutline } from '~/utils';
import { cn } from '~/utils/general';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';

type Props = {
  visible: boolean;
  onClose: () => void;
  name: string;
  onChangeName: (value: string) => void;
  description: string;
  onChangeDescription: (value: string) => void;
  selectedColor: CirclePresetColor;
  onSelectColor: (color: CirclePresetColor) => void;
  onCreate: () => void;
  creating: boolean;
};

function CreateCircleModal({
  visible,
  onClose,
  name,
  onChangeName,
  description,
  onChangeDescription,
  selectedColor,
  onSelectColor,
  onCreate,
  creating,
}: Props) {
  const canCreate = Boolean(name.trim()) && !creating;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center bg-black/50 px-4">
        <Pressable className="absolute inset-0" onPress={onClose} accessibilityLabel="Dismiss" />
        <KeyboardAvoidingView
          behavior={KEYBOARD_BEHAVIOR_IOS_PADDING}
          className="w-full max-w-md self-center"
        >
          <View className="rounded-xl border border-border bg-card p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-base font-semibold text-foreground">Create a new circle</Text>
              <Pressable onPress={onClose} hitSlop={8} className="p-1 active:opacity-70">
                <X size={20} color={Theme.colors.muted} />
              </Pressable>
            </View>
            <TextInput
              placeholder="Circle name..."
              placeholderTextColor={Theme.colors.muted}
              value={name}
              onChangeText={onChangeName}
              maxLength={40}
              editable={!creating}
              className="mb-3 rounded-xl border border-border bg-search-field px-3 py-3 text-sm text-foreground"
              style={[
                webNoOutline,
                textFieldCaretStyle,
                textFieldSingleLineStyle,
                textFieldSingleLineDefaultHeightStyle,
              ]}
            />
            <TextInput
              placeholder="Description (optional)"
              placeholderTextColor={Theme.colors.muted}
              value={description}
              onChangeText={onChangeDescription}
              maxLength={100}
              multiline
              editable={!creating}
              className="mb-3 min-h-[44px] rounded-xl border border-border bg-search-field px-3 py-3 text-sm text-foreground"
              style={[webNoOutline, textFieldCaretStyle, textFieldMultilineStyle]}
            />
            <Text className="mb-2 text-xs text-muted-foreground">Color</Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              {CIRCLE_COLOR_PRESETS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => onSelectColor(c)}
                  disabled={creating}
                  className="h-7 w-7 rounded-full"
                  style={{
                    backgroundColor: c,
                    borderWidth: selectedColor === c ? 3 : 0,
                    borderColor: Theme.colors.foreground,
                  }}
                />
              ))}
            </View>
            <View className="flex-row gap-2">
              <Pressable
                onPress={onClose}
                disabled={creating}
                className="flex-1 items-center rounded-xl border border-border bg-search-field py-3 active:opacity-90 disabled:opacity-50"
              >
                <Text className="text-sm font-medium text-foreground">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (!canCreate) return;
                  onCreate();
                }}
                disabled={!canCreate}
                style={webDisabledCursor(!canCreate)}
                className={cn(
                  'flex-1 items-center rounded-xl py-3',
                  canCreate
                    ? 'cursor-pointer bg-primary active:opacity-90'
                    : 'cursor-not-allowed bg-primary/40 opacity-50',
                )}
              >
                {creating ? (
                  <ActivityIndicator color={Theme.colors.primaryForeground} />
                ) : (
                  <Text className="text-sm font-semibold text-primary-foreground">
                    Create Circle
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
      <ModalToastLayer />
    </Modal>
  );
}

export default CreateCircleModal;
