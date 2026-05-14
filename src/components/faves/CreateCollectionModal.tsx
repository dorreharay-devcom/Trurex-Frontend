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
  fetchUriAsBlob,
  uploadBlobToStorageBucket,
  resizeForUpload,
} from '~/utils/photos/storageUpload';
import { generateRexImageStoragePath } from '~/utils/photos/photoUtils';
import { isWeb, webContainerStyle } from '~/utils';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
import { webNoOutline } from '~/components/recommendation/create/steps/search/common/webInputOutline';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';

import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';

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
      const storagePath = generateRexImageStoragePath(user.id, fileName);
      const resized = await resizeForUpload(asset.uri, 800);
      const blob = await fetchUriAsBlob(resized);
      await uploadBlobToStorageBucket(COLLECTION_COVERS_BUCKET, storagePath, blob);
      setCoverStoragePath(storagePath);
    } catch (e: any) {
      toastError('Upload failed', e?.message);
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
              style={{ maxHeight: height * 0.9 }}
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
                    style={[webNoOutline, textFieldCaretStyle]}
                    className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
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
                    style={[webNoOutline, textFieldCaretStyle]}
                    className="flex min-h-[80px] w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                  <Text className="text-[10px] text-muted-foreground mt-1 text-right">
                    {description.length}/200
                  </Text>
                </View>

                {/* Category tag */}
                <View>
                  <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Category tag (optional)
                  </Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {CATEGORY_TAGS.map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => setCategoryTag(categoryTag === tag ? null : tag)}
                        className={`px-3 py-1.5 rounded-full border ${
                          categoryTag === tag
                            ? 'bg-primary border-primary'
                            : 'bg-muted/50 border-border'
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            categoryTag === tag
                              ? 'text-primary-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    ))}
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
                          className={`w-full p-3 rounded-xl border ${
                            selected ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
                          }`}
                        >
                          <View className="flex-row items-center gap-3">
                            <View
                              className={`w-8 h-8 rounded-lg items-center justify-center ${
                                selected ? 'bg-primary/10' : 'bg-muted'
                              }`}
                            >
                              <Icon size={16} color={selected ? Theme.colors.primary : '#737373'} />
                            </View>
                            <View className="flex-1">
                              <Text
                                className={`text-sm font-semibold ${
                                  selected ? 'text-foreground' : 'text-muted-foreground'
                                }`}
                              >
                                {label}
                              </Text>
                              <Text className="text-xs text-muted-foreground">{desc}</Text>
                            </View>
                            {selected && <Check size={16} color={Theme.colors.primary} />}
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
                  <TouchableOpacity
                    onPress={handleCreate}
                    disabled={!name.trim() || loading || uploading}
                    className={`w-full py-3 rounded-xl bg-primary items-center ${
                      !name.trim() || loading || uploading ? 'opacity-50' : ''
                    }`}
                  >
                    <Text className="text-primary-foreground font-semibold text-sm">
                      {loading ? 'Creating…' : 'Create Collection'}
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
