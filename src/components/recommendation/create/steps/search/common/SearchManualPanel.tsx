import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CreateStepTitle } from '../../../CreateStepTitle';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
import { cn } from '~/utils/general';
import { webNoOutline } from './webInputOutline';

const SCROLL_PAD = 'pb-36';

type Props = {
  manualName: string;
  onManualNameChange: (v: string) => void;
  manualAddress: string;
  onManualAddressChange: (v: string) => void;
  manualGeotag: { lat: number; lng: number } | null;
  onTagLocationPress: () => void;
  onBackToSearchSelect: () => void;
  tagLocationLoading: boolean;
};

export function SearchManualPanel({
  manualName,
  onManualNameChange,
  manualAddress,
  onManualAddressChange,
  manualGeotag,
  onTagLocationPress,
  onBackToSearchSelect,
  tagLocationLoading,
}: Props) {
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName={cn('items-center', SCROLL_PAD)}
    >
      <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
        <View className="items-center space-y-2 px-1 pb-2">
          <CreateStepTitle>Add a new place</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Enter the name and address manually
          </Text>
        </View>

        <TextInput
          value={manualName}
          onChangeText={onManualNameChange}
          placeholder="Name of place, person, or service"
          placeholderTextColor={Theme.colors.secondaryText}
          editable={!tagLocationLoading}
          className={`w-full rounded-[12px] border border-border bg-muted/50 px-4 py-3.5 text-base text-foreground ${INPUT_FOCUS_RING_CLASS}`}
          style={[webNoOutline, textFieldCaretStyle]}
          autoCorrect
          autoCapitalize="words"
          underlineColorAndroid="transparent"
          selectionColor={Theme.colors.foreground}
        />

        <TextInput
          value={manualAddress}
          onChangeText={onManualAddressChange}
          placeholder="Address or location (optional)"
          placeholderTextColor={Theme.colors.secondaryText}
          editable={!tagLocationLoading}
          className={`w-full rounded-[12px] border border-border bg-muted/50 px-4 py-3.5 text-base text-foreground ${INPUT_FOCUS_RING_CLASS}`}
          style={[webNoOutline, textFieldCaretStyle]}
          autoCorrect
          autoCapitalize="sentences"
          underlineColorAndroid="transparent"
          selectionColor={Theme.colors.foreground}
        />

        {tagLocationLoading ? (
          <View className="w-full flex-row items-center gap-2 rounded-lg py-2">
            <ActivityIndicator size="small" color={Theme.colors.primary} />
            <Text className="text-sm text-muted-foreground">Getting your location…</Text>
          </View>
        ) : (
          <Pressable
            onPress={onTagLocationPress}
            className="w-full flex-row items-center gap-1.5 rounded-lg py-2 active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel={manualGeotag ? 'Update geotagged location' : 'Tag current location'}
          >
            <MapPin size={18} color={Theme.colors.secondaryText} />
            <Text className="text-sm text-muted-foreground">
              {manualGeotag
                ? `Geotagged (${manualGeotag.lat.toFixed(4)}, ${manualGeotag.lng.toFixed(4)})`
                : 'Tag current location'}
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={onBackToSearchSelect}
          className="group -mx-1 self-start rounded-lg px-1 py-2"
          accessibilityRole="button"
          accessibilityLabel="Back to search"
        >
          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground group-hover:text-foreground group-active:text-foreground">
              ←{' '}
            </Text>
            <Text className="text-sm text-muted-foreground underline-offset-2 decoration-foreground group-hover:text-foreground group-hover:underline group-active:text-foreground group-active:underline">
              Back to search
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}
