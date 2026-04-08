import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { ArrowLeft, Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '~/services/AuthContext';
// import { ProfileApi } from '~/api/ProfileApi'; // stashed with api layer
import { Theme } from '~/theme/Theme';
import { Button } from '~/components/common/Button';
import Input from '~/components/common/Input';

interface EditProfileProps {
  onClose: () => void;
}

interface CurrentlyData {
  binging?: string;
  listening?: string;
  reading?: string;
}

const currentlyFields = [
  { key: 'binging' as const, emoji: '🎬', label: 'Binging' },
  { key: 'listening' as const, emoji: '🎵', label: 'Listening to' },
  { key: 'reading' as const, emoji: '📖', label: 'Reading' },
];

const fieldLabelClassName = 'text-xs text-muted-foreground uppercase tracking-wide';

const EditProfile = ({ onClose }: EditProfileProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl] = useState<string | null>(null);
  const [currently, setCurrently] = useState<CurrentlyData>({});

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [user]);

  const handleAvatarPick = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0] || !user) return;

    setUploading(true);
    try {
      // ProfileApi.uploadAvatar stashed with api layer
    } catch (e) {
      const error = e as Error;
      Alert.alert('Upload failed', error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // ProfileApi.update stashed with api layer
      onClose();
    } catch (e) {
      const error = e as Error;
      Alert.alert('Error saving profile', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="h-96 items-center justify-center">
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <View className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="p-1.5 rounded-lg"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={20} color={Theme.colors.foreground} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-foreground">Edit Profile</Text>
        </View>

        <Button
          title="Save"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          className="px-4 py-2"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
        contentContainerClassName="py-6 gap-6"
      >
        {/* Avatar */}
        <View className="items-center gap-3">
          <TouchableOpacity onPress={handleAvatarPick} activeOpacity={0.85} className="relative">
            <View className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-border bg-muted">
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-3xl font-bold text-muted-foreground">
                    {displayName?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
              )}
            </View>
            <View className="absolute inset-0 rounded-2xl bg-foreground/40 items-center justify-center">
              {uploading ? (
                <ActivityIndicator color={Theme.colors.card} size="small" />
              ) : (
                <Camera size={24} color={Theme.colors.card} />
              )}
            </View>
          </TouchableOpacity>
          <Text className="text-xs text-muted-foreground">Tap to change photo</Text>
        </View>

        {/* Basic Info */}
        <View className="gap-4">
          <Input
            label="Display Name"
            labelClassName={fieldLabelClassName}
            inputClassName="bg-background rounded-xl"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            maxLength={50}
          />

          {/* Handle — custom layout due to @ prefix */}
          <View>
            <Text className={`${fieldLabelClassName} mb-1.5`}>Handle</Text>
            <View className="flex-row items-center bg-background border border-border rounded-xl overflow-hidden">
              <Text className="pl-3 text-sm text-muted-foreground">@</Text>
              <TextInput
                value={handle}
                onChangeText={(t) => setHandle(t.replace(/[^a-zA-Z0-9_]/g, ''))}
                placeholder="yourhandle"
                placeholderTextColor={Theme.colors.muted}
                maxLength={30}
                autoCapitalize="none"
                className="flex-1 px-2 py-2.5 text-sm text-foreground"
              />
            </View>
          </View>

          <View>
            <Input
              label="Bio"
              labelClassName={fieldLabelClassName}
              inputClassName="bg-background rounded-xl min-h-[80px]"
              value={bio}
              onChangeText={setBio}
              placeholder="Tell people what you're all about..."
              maxLength={160}
              multiline
              numberOfLines={3}
            />
            <Text className="text-[11px] text-muted-foreground mt-1 text-right">
              {bio.length}/160
            </Text>
          </View>

          <Input
            label="Location"
            labelClassName={fieldLabelClassName}
            inputClassName="bg-background rounded-xl"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Brooklyn, NY"
            maxLength={50}
          />
        </View>

        {/* Currently Section */}
        <View>
          <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Currently...
          </Text>
          <View className="gap-3">
            {currentlyFields.map((field) => (
              <View
                key={field.key}
                className="flex-row items-center gap-3 p-3 rounded-xl bg-background border border-border"
              >
                <Text className="text-lg">{field.emoji}</Text>
                <View className="flex-1 min-w-0">
                  <Text className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">
                    {field.label}
                  </Text>
                  <TextInput
                    value={currently[field.key] || ''}
                    onChangeText={(t) => setCurrently((prev) => ({ ...prev, [field.key]: t }))}
                    placeholder={`What are you ${field.label.toLowerCase()}?`}
                    placeholderTextColor={Theme.colors.muted}
                    maxLength={80}
                    className="text-sm text-foreground"
                    style={{ padding: 0, height: 24 }}
                  />
                </View>
                {!!currently[field.key] && (
                  <TouchableOpacity
                    onPress={() => setCurrently((prev) => ({ ...prev, [field.key]: '' }))}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    className="p-1"
                  >
                    <X size={14} color={Theme.colors.muted} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;
