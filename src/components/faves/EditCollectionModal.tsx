import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { X, Upload, Lock, Users, Globe } from 'lucide-react-native';
import type { CollectionVisibility } from '~/api/CollectionsApi';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useUpdateCollection } from '~/hooks/useCollections';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { toastError } from '~/utils/appToast';
import {
  preparePickerImageForUpload,
  uploadBlobToStorageBucket,
} from '~/utils/photos/storageUpload';
import { generateRexImageStoragePath } from '~/utils/photos/photoUtils';
import { isWeb, webContainerStyle } from '~/utils';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { useAuth } from '~/services/AuthContext';

const collectionFieldBg = { backgroundColor: Theme.colors.searchFieldBackground };

const VISIBILITY_OPTIONS: {
  value: CollectionVisibility;
  label: string;
  sublabel: string;
  Icon: React.ComponentType<any>;
}[] = [
  { value: 'private', label: 'Private', sublabel: 'Only you', Icon: Lock },
  { value: 'shared', label: 'Circles', sublabel: 'Your circles', Icon: Users },
  { value: 'public', label: 'Public', sublabel: 'Everyone', Icon: Globe },
];

export interface EditCollectionModalProps {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  collection: {
    id: string;
    display_name: string;
    description: string | null;
    cover_image_path: string | null;
    visibility?: CollectionVisibility;
  };
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  open,
  onClose,
  onUpdated,
  collection,
}) => {
  const { user } = useAuth();
  const { width, height } = useWindowDimensions();

  const [visible, setVisible] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (open) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(sheetTranslateY, { toValue: 600, duration: 220, useNativeDriver: true }),
      ]).start(() => setVisible(false));
    }
  }, [open]);

  // Sync form fields when collection changes (e.g. modal reopened for different collection)
  const [name, setName] = useState(collection.display_name);
  const [description, setDescription] = useState(collection.description ?? '');
  const [visibility, setVisibility] = useState<CollectionVisibility>(
    collection.visibility ?? 'private',
  );
  useEffect(() => {
    setName(collection.display_name);
    setDescription(collection.description ?? '');
    setVisibility(collection.visibility ?? 'private');
    setNewCoverPreview(null);
    setNewCoverStoragePath(null);
    setCoverRemoved(false);
  }, [collection.id, open]);

  // Cover: existing (signed) vs new pick vs removed
  const { uri: existingCoverUri } = useSignedStorageUrl(
    REX_IMAGES_BUCKET,
    collection.cover_image_path ?? '',
  );
  const [newCoverPreview, setNewCoverPreview] = useState<string | null>(null);
  const [newCoverStoragePath, setNewCoverStoragePath] = useState<string | null>(null);
  const [coverRemoved, setCoverRemoved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const updateMutation = useUpdateCollection();
  const loading = updateMutation.isPending;

  const pickCover = async () => {
    if (!user) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      toastError('Photos', 'Please allow photo library access to add a cover image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    setNewCoverPreview(asset.uri);
    setCoverRemoved(false);
    setUploading(true);
    try {
      const fileName = asset.fileName ?? `cover-${Date.now()}.jpg`;
      const prepared = await preparePickerImageForUpload(asset.uri, fileName, 800);
      const storagePath = generateRexImageStoragePath(user.id, prepared.fileName ?? fileName);
      await uploadBlobToStorageBucket(REX_IMAGES_BUCKET, storagePath, prepared.blob);
      setNewCoverStoragePath(storagePath);
    } catch (e: any) {
      toastError('Upload failed', e?.message);
      setNewCoverPreview(null);
      setNewCoverStoragePath(null);
    } finally {
      setUploading(false);
    }
  };

  const removeCover = () => {
    setNewCoverPreview(null);
    setNewCoverStoragePath(null);
    setCoverRemoved(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const coverChanged = newCoverStoragePath !== null || coverRemoved;

    updateMutation.mutate(
      {
        collection_id: collection.id,
        display_name: name.trim(),
        description: description.trim() || null,
        update_cover_image_path: coverChanged,
        cover_image_path: coverChanged ? (newCoverStoragePath ?? null) : undefined,
        visibility,
      },
      { onSuccess: onUpdated },
    );
  };

  // Determine what cover to display
  const displayCoverUri = newCoverPreview ?? (coverRemoved ? null : existingCoverUri);
  const hasCover = !!displayCoverUri;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents="box-none"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <View style={styles.overlay} pointerEvents="box-none">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
          style={{ width: '100%', maxWidth: isWeb ? 512 : width }}
        >
          <Animated.View style={{ transform: [{ translateY: sheetTranslateY }] }}>
            <View
              style={{ maxHeight: height * 0.9 }}
              className={`bg-card ${isWeb ? 'rounded-2xl' : 'rounded-t-2xl'} border border-border shadow-elevated overflow-hidden`}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between p-4 border-b border-border bg-card">
                <Text className="font-display font-bold text-foreground text-lg">
                  Edit Collection
                </Text>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <X size={20} color={Theme.colors.muted} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[{ padding: 16, gap: 20 }, webContainerStyle]}
              >
                {/* Cover image */}
                <View>
                  <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Cover image (optional)
                  </Text>
                  {hasCover ? (
                    <View className="rounded-xl overflow-hidden">
                      <Image
                        source={{ uri: displayCoverUri }}
                        style={{ width: '100%', height: 128 }}
                        contentFit="contain"
                      />
                      {uploading && (
                        <View className="absolute inset-0 bg-background/60 items-center justify-center">
                          <ActivityIndicator color={Theme.colors.primary} />
                        </View>
                      )}
                      <TouchableOpacity
                        onPress={removeCover}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/50"
                      >
                        <X size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={pickCover}
                      className="w-full py-6 rounded-xl border-2 border-dashed border-border items-center gap-2"
                    >
                      <Upload size={20} color={Theme.colors.muted} />
                      <Text className="text-xs text-muted-foreground font-medium">
                        Add a cover image
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Name */}
                <View>
                  <Text className="text-xs font-semibold text-muted-foreground mb-1.5">Name *</Text>
                  <TextInput
                    value={name}
                    onChangeText={(v) => setName(v.slice(0, 60))}
                    placeholder="Collection name"
                    placeholderTextColor={Theme.colors.secondaryText}
                    style={collectionFieldBg}
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm text-foreground"
                  />
                  <Text className="text-[10px] text-muted-foreground mt-1 text-right">
                    {name.length}/60
                  </Text>
                </View>

                {/* Visibility */}
                <View>
                  <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Visibility
                  </Text>
                  <View className="flex-row gap-2">
                    {VISIBILITY_OPTIONS.map(({ value, label, sublabel, Icon }) => {
                      const active = visibility === value;
                      return (
                        <TouchableOpacity
                          key={value}
                          onPress={() => setVisibility(value)}
                          activeOpacity={0.7}
                          style={active ? undefined : collectionFieldBg}
                          className={cn(
                            'flex-1 items-center py-3 rounded-xl border',
                            active ? 'border-primary bg-accent' : 'border-border',
                          )}
                        >
                          <Icon
                            size={16}
                            color={active ? Theme.brand.colorDark : Theme.colors.secondaryText}
                          />
                          <Text className="mt-1 text-xs font-semibold text-foreground">
                            {label}
                          </Text>
                          <Text className="mt-0.5 text-[10px] text-muted-foreground">
                            {sublabel}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Description */}
                <View>
                  <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Description (optional)
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={(v) => setDescription(v.slice(0, 200))}
                    placeholder="What's this list about?"
                    placeholderTextColor={Theme.colors.secondaryText}
                    multiline
                    numberOfLines={2}
                    textAlignVertical="top"
                    style={collectionFieldBg}
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm text-foreground"
                  />
                  <Text className="text-[10px] text-muted-foreground mt-1 text-right">
                    {description.length}/200
                  </Text>
                </View>
              </ScrollView>

              {/* Footer */}
              <View className="border-t border-border bg-card">
                <View style={[{ padding: 16 }, webContainerStyle]}>
                  <TouchableOpacity
                    onPress={handleSave}
                    disabled={!name.trim() || loading || uploading}
                    className={`w-full py-3 rounded-xl bg-primary items-center ${
                      !name.trim() || loading || uploading ? 'opacity-50' : ''
                    }`}
                  >
                    <Text className="text-primary-foreground font-semibold text-sm">
                      {loading ? 'Saving…' : 'Save Changes'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
      <ModalToastLayer />
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    flex: 1,
    justifyContent: isWeb ? 'center' : 'flex-end',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
});

export default EditCollectionModal;
