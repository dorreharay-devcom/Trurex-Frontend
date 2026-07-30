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
  Keyboard,
  Platform,
  type TextStyle,
} from 'react-native';
import { ArrowLeft, Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '~/features/auth/providers';
import { AuthApi } from '~/shared/api/auth';
import { ProfileApi } from '~/api/ProfileApi';
import { Routes } from '~/shared/config/routes';
import { Theme, textFieldCaretStyle, textFieldSingleLineStyle } from '~/shared/theme/Theme';
import { Button } from '~/shared/ui/Button';
import Input from '~/shared/ui/Input';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { DestructiveActionConfirmModal } from '~/components/common/DestructiveActionConfirmModal';
import { BlockedUsersEntryRow, BlockedUsersPanel } from '~/components/profile/BlockedUsersPanel';
import { USER_AVATARS_BUCKET } from '~/constants/storageBuckets';
import { toastError } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { pickLibraryImages } from '~/utils/photos/imagePickerLaunch';
import { photoUploadErrorMessage } from '~/utils/photos/storageUpload';
import { unknownErrorMessage } from '~/utils';
import { useBlockedUsers } from '~/hooks/useBlockUser';

interface EditProfileProps {
  onClose: () => void;
}

interface CurrentlyData {
  binging?: string;
  listening?: string;
  reading?: string;
}

type PendingAvatar = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  dispose?: () => void;
};

const currentlyFields = [
  { key: 'binging' as const, emoji: '🎬', label: 'Binging' },
  { key: 'listening' as const, emoji: '🎵', label: 'Listening to' },
  { key: 'reading' as const, emoji: '📖', label: 'Reading' },
];

const fieldLabelClassName = 'text-xs text-muted-foreground uppercase tracking-wide';

const normalizeHandleInput = (value: string | null | undefined) =>
  (value ?? '').trim().replace(/^@+/, '');

const normalizeHandleForSave = (value: string) => {
  const trimmed = normalizeHandleInput(value);
  return trimmed ? trimmed.replace(/\s+/g, '').toLowerCase() : null;
};

const EditProfile = ({ onClose }: EditProfileProps) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const { data: blockedUsers } = useBlockedUsers(user?.id);

  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [handleFocused, setHandleFocused] = useState(false);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [currently, setCurrently] = useState<CurrentlyData>({});
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  const [pendingAvatar, setPendingAvatar] = useState<PendingAvatar | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    ProfileApi.getCurrentUser(user.id)
      .then((data) => {
        setDisplayName(data.display_name || '');
        setHandle(normalizeHandleInput(data.handle));
        setBio(data.bio || '');
        setLocation(data.location || '');
        setCurrentAvatarUrl(data.avatar_url);
        setAvatarRemoved(false);
        setCurrently({
          binging: data.currently_binging || '',
          listening: data.currently_listening_to || '',
          reading: data.currently_reading || '',
        });
      })
      .catch((e) => console.error('[EditProfile] Initial load failed:', e))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    return () => pendingAvatar?.dispose?.();
  }, [pendingAvatar]);

  const handleAvatarPick = async () => {
    if (!user) return;

    if (Platform.OS !== 'web') {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission required', 'Please allow access to your photo library.');
        return;
      }
    }

    setUploading(true);
    try {
      const assets = await pickLibraryImages(1);
      const asset = assets[0];
      if (!asset) return;

      setPendingAvatar((prev) => {
        prev?.dispose?.();
        return {
          uri: asset.uri,
          fileName: asset.fileName,
          mimeType: asset.mimeType,
          dispose: asset.dispose,
        };
      });
      setAvatarRemoved(false);
    } catch (e) {
      toastError('Photo unavailable', photoUploadErrorMessage(e));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
    setSaving(true);
    try {
      if (pendingAvatar) {
        const publicUrl = await ProfileApi.uploadAvatar(
          user.id,
          pendingAvatar.uri,
          pendingAvatar.fileName ?? `avatar-${Date.now()}.jpg`,
          pendingAvatar.mimeType,
        );
        pendingAvatar.dispose?.();
        setCurrentAvatarUrl(publicUrl);
        setPendingAvatar(null);
        setAvatarRemoved(false);
      } else if (avatarRemoved) {
        await ProfileApi.updateAvatar('');
        setCurrentAvatarUrl(null);
        setAvatarRemoved(false);
      }

      await ProfileApi.update(user.id, {
        display_name: displayName,
        handle: normalizeHandleForSave(handle),
        bio: bio || null,
        location: location || null,
        currently_binging: currently.binging || null,
        currently_listening_to: currently.listening || null,
        currently_reading: currently.reading || null,
      });
      onClose();
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Failed to save profile', photoUploadErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await AuthApi.deleteAccount();
      try {
        await signOut();
      } catch {
        await AuthApi.signOut().catch(() => {});
      }
      setDeleteConfirmVisible(false);
      onClose();
      router.replace(Routes.Signup);
    } catch (e) {
      toastError('Could not delete account', unknownErrorMessage(e, 'Please try again.'));
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <View className="h-96 items-center justify-center">
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }

  if (showBlockedUsers) {
    return <BlockedUsersPanel onBack={() => setShowBlockedUsers(false)} />;
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
          <View className="relative">
            <TouchableOpacity onPress={handleAvatarPick} activeOpacity={0.85} className="relative">
              <View className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-border bg-muted">
                {pendingAvatar ? (
                  <Image
                    source={{ uri: pendingAvatar.uri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : currentAvatarUrl ? (
                  <SignedStorageImage
                    bucket={USER_AVATARS_BUCKET}
                    storagePath={currentAvatarUrl}
                    remoteUri={currentAvatarUrl}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-3xl font-bold text-muted-foreground">
                      {displayName?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>
                )}
              </View>
              {(uploading || (!pendingAvatar && !currentAvatarUrl)) && (
                <View className="absolute inset-0 rounded-2xl bg-muted/50 items-center justify-center">
                  {uploading ? (
                    <ActivityIndicator color={Theme.colors.card} size="small" />
                  ) : (
                    <Camera size={24} color={Theme.colors.card} />
                  )}
                </View>
              )}
            </TouchableOpacity>
            {(pendingAvatar || currentAvatarUrl) && !uploading && (
              <TouchableOpacity
                onPress={() => {
                  setPendingAvatar((prev) => {
                    prev?.dispose?.();
                    return null;
                  });
                  setCurrentAvatarUrl(null);
                  setAvatarRemoved(true);
                }}
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full bg-card border border-border shadow-card"
              >
                <X size={14} color={Theme.colors.foreground} />
              </TouchableOpacity>
            )}
          </View>
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
            <View
              className={`h-12 flex-row items-center overflow-hidden rounded-xl border bg-background ${
                handleFocused ? 'border-primary' : 'border-border'
              }`}
              style={
                Platform.OS === 'web' && handleFocused
                  ? { boxShadow: '0 0 0 2px rgba(183, 199, 207, 0.4)' }
                  : undefined
              }
            >
              <Text
                className="pl-3 text-sm text-muted-foreground"
                style={Platform.OS === 'web' ? undefined : { lineHeight: 18 }}
              >
                @
              </Text>
              <TextInput
                value={handle}
                onChangeText={(t) => setHandle(normalizeHandleInput(t))}
                placeholder="yourhandle"
                placeholderTextColor={Theme.colors.muted}
                maxLength={30}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'default'}
                textContentType="username"
                onFocus={() => setHandleFocused(true)}
                onBlur={() => setHandleFocused(false)}
                className="h-12 flex-1 px-2 text-sm text-foreground"
                style={[
                  textFieldCaretStyle,
                  textFieldSingleLineStyle,
                  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : null,
                  Platform.OS === 'web' ? null : { paddingTop: 0, paddingBottom: 0 },
                ]}
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
                    style={[
                      textFieldCaretStyle,
                      textFieldSingleLineStyle,
                      { padding: 0, height: 24 },
                    ]}
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

        <View className="gap-3 pt-2 border-t border-border">
          <BlockedUsersEntryRow
            onPress={() => setShowBlockedUsers(true)}
            disabled={saving || deletingAccount}
            count={blockedUsers?.length}
          />

          <TouchableOpacity
            onPress={() => setDeleteConfirmVisible(true)}
            activeOpacity={0.7}
            disabled={saving || deletingAccount}
            className="items-center rounded-xl border border-destructive/30 bg-destructive/5 py-3 disabled:opacity-50"
          >
            <Text className="text-sm font-semibold text-destructive">Delete account</Text>
          </TouchableOpacity>
          <Text className="text-center text-[11px] text-muted-foreground">
            Permanently removes your account and all associated data.
          </Text>
        </View>
      </ScrollView>

      <DestructiveActionConfirmModal
        visible={deleteConfirmVisible}
        title="Delete your account?"
        message="This will permanently delete your account, rexes, collections, and all other data. This action cannot be undone."
        confirmLabel="Delete account"
        pending={deletingAccount}
        onCancel={() => !deletingAccount && setDeleteConfirmVisible(false)}
        onConfirm={() => void handleConfirmDeleteAccount()}
      />
    </View>
  );
};

export default EditProfile;
