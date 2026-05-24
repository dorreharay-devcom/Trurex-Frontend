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
import { X, Upload, Lock, Link2, Globe, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useAuth } from '~/services/AuthContext';
import { useCreateCollection } from '~/hooks/useCollections';
import { toastSuccess, toastError } from '~/utils/appToast';
import {
  preparePickerImageForUpload,
  uploadBlobToStorageBucket,
} from '~/utils/photos/storageUpload';
import { generateRexImageStoragePath } from '~/utils/photos/photoUtils';
import { isWeb, webContainerStyle } from '~/utils';
import {
  Theme,
  textFieldCaretStyle,
  textFieldMultilineStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/theme/Theme';
import { cn } from '~/utils/general';
import { webNoOutline } from '~/components/recommendation/create/steps/search/common/webInputOutline';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';
import { INPUT_FOCUS_BORDER_CLASS } from '~/constants/inputFocus';

import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';

const collectionFieldBg = { backgroundColor: Theme.colors.searchFieldBackground };

const COLLECTION_COVERS_BUCKET = REX_IMAGES_BUCKET;

const CATEGORY_TAGS = [
  'Food & Drink',
  'Experiences',
  'Travel',
  'Outdoors',
  'Culture',
  'Shopping',
  'Services',
  'Mixed',
];

type Privacy = 'private' | 'shared' | 'public';

const PRIVACY_OPTIONS: {
  value: Privacy;
  label: string;
  desc: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
}[] = [
  { value: 'private', label: 'Private', desc: 'Only you can see this', Icon: Lock },
  {
    value: 'shared',
    label: 'Shared',
    desc: 'Share via link or with specific Circles',
    Icon: Link2,
  },
  {
    value: 'public',
    label: 'Public',
    desc: 'Anyone on TruRex can find and follow this',
    Icon: Globe,
  },
];

export interface CreateCollectionModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  open,
  onClose,
  onCreated,
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

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryTag, setCategoryTag] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<Privacy>('private');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverStoragePath, setCoverStoragePath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const createColMutation = useCreateCollection();
  const loading = createColMutation.isPending;
  const canCreate = Boolean(name.trim()) && !loading && !uploading;

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
    setCoverPreview(asset.uri);
    setUploading(true);
    try {
      const fileName = asset.fileName ?? `cover-${Date.now()}.jpg`;
      const prepared = await preparePickerImageForUpload(asset.uri, fileName, 800);
      const storagePath = generateRexImageStoragePath(user.id, prepared.fileName ?? fileName);
      await uploadBlobToStorageBucket(COLLECTION_COVERS_BUCKET, storagePath, prepared.blob);
      setCoverStoragePath(storagePath);
    } catch (e: unknown) {
      toastError('Upload failed', e instanceof Error ? e.message : 'Could not upload cover image.');
      setCoverPreview(null);
      setCoverStoragePath(null);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!user || !name.trim()) return;

    createColMutation.mutate(
      {
        display_name: name.trim(),
        description: description.trim() || undefined,
        cover_image_path: coverStoragePath ?? undefined,
        visibility: privacy,
      },
      {
        onSuccess: (collection) => {
          onCreated(collection.id);
          setName('');
          setDescription('');
          setCategoryTag(null);
          setPrivacy('private');
          setCoverPreview(null);
          setCoverStoragePath(null);
        },
      },
    );
  };

  // web: fixed inset-0 z-[100] flex items-end sm:items-center justify-center
  // web panel: bg-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh]
  //            overflow-y-auto border border-border shadow-elevated
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
              style={{
                maxHeight: height * 0.9,
                ...(Platform.OS === 'web' ? null : { height: height * 0.82 }),
              }}
              className={`bg-card ${isWeb ? 'rounded-2xl' : 'rounded-t-2xl'} border border-border shadow-elevated overflow-hidden`}
            >
              {/* sticky top-0 bg-card z-10 — Header */}
              <View className="flex-row items-center justify-between p-4 border-b border-border bg-card">
                <Text className="font-display font-bold text-foreground text-lg">
                  New Collection
                </Text>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <X size={20} color={Theme.colors.muted} />
                </TouchableOpacity>
              </View>

              {/* p-4 space-y-5 — scrollable content */}
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
                  {coverPreview ? (
                    <View className="rounded-xl overflow-hidden">
                      <Image
                        source={{ uri: coverPreview }}
                        style={{ width: '100%', height: 128 }}
                        contentFit="cover"
                      />
                      {uploading && (
                        <View className="absolute inset-0 bg-background/60 items-center justify-center">
                          <ActivityIndicator color={Theme.colors.primary} />
                        </View>
                      )}
                      <TouchableOpacity
                        onPress={() => {
                          setCoverPreview(null);
                          setCoverStoragePath(null);
                        }}
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
                  <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Name your collection *
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={(v) => setName(v.slice(0, 60))}
                    placeholder="e.g. My Ideal Weekend in Lisbon, Best Hikes in Sydney…"
                    placeholderTextColor={Theme.colors.secondaryText}
                    underlineColorAndroid="transparent"
                    selectionColor={Theme.colors.foreground}
                    style={[
                      webNoOutline,
                      textFieldCaretStyle,
                      textFieldSingleLineStyle,
                      textFieldSingleLineDefaultHeightStyle,
                      collectionFieldBg,
                    ]}
                    className={`w-full rounded-xl border border-border px-4 py-3 text-sm text-foreground ${INPUT_FOCUS_BORDER_CLASS}`}
                  />
                  <Text className="text-[10px] text-muted-foreground mt-1 text-right">
                    {name.length}/60
                  </Text>
                </View>

                {/* Description */}
                <View>
                  <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Description (optional)
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={(v) => setDescription(v.slice(0, 200))}
                    placeholder="What's this list about? Who's it for?"
                    placeholderTextColor={Theme.colors.secondaryText}
                    multiline
                    numberOfLines={2}
                    textAlignVertical="top"
                    underlineColorAndroid="transparent"
                    selectionColor={Theme.colors.foreground}
                    style={[
                      webNoOutline,
                      textFieldCaretStyle,
                      textFieldMultilineStyle,
                      collectionFieldBg,
                    ]}
                    className={`flex min-h-[80px] w-full rounded-xl border border-border px-4 py-3 text-sm text-foreground ${INPUT_FOCUS_BORDER_CLASS}`}
                  />
                  <Text className="text-[10px] text-muted-foreground mt-1 text-right">
                    {description.length}/200
                  </Text>
                </View>

                {/* Category tag */}
                <View>
                  <Text className="mb-1.5 text-xs font-semibold text-muted-foreground">
                    Category tag (optional)
                  </Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {CATEGORY_TAGS.map((tag) => {
                      const on = categoryTag === tag;
                      return (
                        <Pressable
                          key={tag}
                          onPress={() => setCategoryTag(on ? null : tag)}
                          className={cn(
                            'rounded-full border px-3 py-1.5 active:opacity-90',
                            on ? 'border-primary bg-primary' : 'border-border bg-muted/50',
                          )}
                          accessibilityRole="button"
                          accessibilityState={{ selected: on }}
                        >
                          <Text
                            className={cn(
                              'text-xs font-medium',
                              on ? 'text-primary-foreground' : 'text-foreground',
                            )}
                          >
                            {tag}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Privacy */}
                <View>
                  <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Privacy setting
                  </Text>
                  <View className="gap-2">
                    {PRIVACY_OPTIONS.map(({ value, label, desc, Icon }) => {
                      const selected = privacy === value;
                      return (
                        <TouchableOpacity
                          key={value}
                          onPress={() => setPrivacy(value)}
                          style={selected ? undefined : collectionFieldBg}
                          className={cn(
                            'w-full rounded-xl border p-3',
                            selected ? 'border-primary bg-accent' : 'border-border',
                          )}
                        >
                          <View className="flex-row items-center gap-3">
                            <View
                              className={cn(
                                'h-8 w-8 items-center justify-center rounded-lg',
                                selected ? 'bg-primary/15' : 'bg-card',
                              )}
                            >
                              <Icon
                                size={16}
                                color={
                                  selected ? Theme.brand.colorDark : Theme.colors.secondaryText
                                }
                              />
                            </View>
                            <View className="flex-1">
                              <Text className="text-sm font-semibold text-foreground">{label}</Text>
                              <Text className="text-xs text-muted-foreground">{desc}</Text>
                            </View>
                            {selected && <Check size={16} color={Theme.brand.colorDark} />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>

              {/* sticky bottom-0 bg-card — Footer */}
              <View className="border-t border-border bg-card">
                <View style={[{ padding: 16 }, webContainerStyle]}>
                  <View
                    className={cn('w-full', !canCreate && isWeb && 'cursor-not-allowed')}
                    style={!canCreate && isWeb ? ({ cursor: 'not-allowed' } as const) : undefined}
                  >
                    <Pressable
                      onPress={() => {
                        if (!canCreate) return;
                        void handleCreate();
                      }}
                      disabled={!canCreate && Platform.OS !== 'web'}
                      accessibilityRole="button"
                      accessibilityState={{ disabled: !canCreate }}
                      style={!canCreate && isWeb ? ({ cursor: 'not-allowed' } as const) : undefined}
                      className={cn(
                        'w-full items-center rounded-xl py-3',
                        canCreate
                          ? 'cursor-pointer bg-primary active:opacity-90'
                          : 'cursor-not-allowed bg-primary/40 opacity-50',
                      )}
                    >
                      {loading ? (
                        <ActivityIndicator color={Theme.colors.primaryForeground} />
                      ) : (
                        <Text
                          pointerEvents="none"
                          className="text-sm font-semibold text-primary-foreground"
                        >
                          Create Collection
                        </Text>
                      )}
                    </Pressable>
                  </View>
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
  // web: items-center (centered), native: items-end (bottom sheet)
  overlay: {
    flex: 1,
    justifyContent: isWeb ? 'center' : 'flex-end',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
});

export default CreateCollectionModal;
