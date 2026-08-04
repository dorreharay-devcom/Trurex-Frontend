import React from 'react';
import { Text, View } from 'react-native';
import { isIos } from '~/shared/lib/ui/platform';
import { Input } from '~/shared/ui/Input';

const FIELD_LABEL_CLASS = 'text-xs uppercase tracking-wide text-muted-foreground';

type Props = {
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  handle: string;
  onHandleChange: (value: string) => void;
  bio: string;
  onBioChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
};

const EditProfileBasics = ({
  displayName,
  onDisplayNameChange,
  handle,
  onHandleChange,
  bio,
  onBioChange,
  location,
  onLocationChange,
}: Props) => (
  <View className="gap-4">
    <Input
      label="Display Name"
      labelClassName={FIELD_LABEL_CLASS}
      inputClassName="rounded-xl bg-background"
      value={displayName}
      onChangeText={onDisplayNameChange}
      placeholder="Your name"
      maxLength={50}
    />

    <Input
      label="Handle"
      labelClassName={FIELD_LABEL_CLASS}
      inputClassName="h-12 rounded-xl bg-background"
      prefix="@"
      value={handle}
      onChangeText={onHandleChange}
      placeholder="yourhandle"
      maxLength={30}
      autoCorrect={false}
      spellCheck={false}
      keyboardType={isIos ? 'ascii-capable' : 'default'}
      textContentType="username"
    />

    <View>
      <Input
        label="Bio"
        labelClassName={FIELD_LABEL_CLASS}
        inputClassName="min-h-[80px] rounded-xl bg-background"
        value={bio}
        onChangeText={onBioChange}
        placeholder="Tell people what you're all about..."
        maxLength={160}
        multiline
        numberOfLines={3}
      />
      <Text className="mt-1 text-right text-[11px] text-muted-foreground">{bio.length}/160</Text>
    </View>

    <Input
      label="Location"
      labelClassName={FIELD_LABEL_CLASS}
      inputClassName="rounded-xl bg-background"
      value={location}
      onChangeText={onLocationChange}
      placeholder="e.g. Brooklyn, NY"
      maxLength={50}
    />
  </View>
);

export default EditProfileBasics;
