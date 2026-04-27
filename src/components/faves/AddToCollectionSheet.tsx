import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { Plus, Check, Image as ImageIcon, AlertCircle, MapPin } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Backend } from '~/services/AuthService';
import { CollectionsApi, UserCollection } from '~/api/CollectionsApi';
import { useAuth } from '~/services/AuthContext';
import { toastSuccess } from '~/utils/appToast';
import { webContainerStyle } from '~/utils';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { Theme } from '~/theme/Theme';

export interface RecSummary {
  id: string;
  place_name: string;
  category_code: string;
  location?: string;
  isSaved?: boolean;
}

interface CollectionWithCount extends UserCollection {
  item_count: number;
  alreadyHasRec: boolean;
}

export interface AddToCollectionSheetProps {
  open: boolean;
  rec: RecSummary | null;
  onClose: () => void;
}

const CollectionRow: React.FC<{
  col: CollectionWithCount;
  isAdded: boolean;
  isJustAdded: boolean;
  onPress: () => void;
}> = ({ col, isAdded, isJustAdded, onPress }) => {
  const { uri: coverUri } = useSignedStorageUrl(REX_IMAGES_BUCKET, col.cover_image_path ?? '');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isAdded ? 1 : 0.7}
      disabled={isAdded}
      className={`w-full flex-row items-center gap-3 p-3 rounded-xl ${isAdded ? 'opacity-70' : ''}`}
    >
      <View className="w-10 h-10 rounded-lg bg-muted overflow-hidden items-center justify-center shrink-0">
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={{ width: 40, height: 40 }} contentFit="cover" />
        ) : (
          <ImageIcon size={16} color={Theme.colors.muted} />
        )}
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {col.display_name}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {isAdded && !isJustAdded
            ? 'Already added'
            : `${col.item_count} item${col.item_count !== 1 ? 's' : ''}`}
        </Text>
      </View>
      {isAdded && <Check size={18} color={Theme.colors.primary} />}
    </TouchableOpacity>
  );
};

const AddToCollectionSheet: React.FC<AddToCollectionSheetProps> = ({ open, rec, onClose }) => {
  const { user } = useAuth();
  const { height } = useWindowDimensions();

  const [visible, setVisible] = useState(false);
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [addedTo, setAddedTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (open && rec) {
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
    } else if (!open) {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(sheetTranslateY, { toValue: 600, duration: 220, useNativeDriver: true }),
      ]).start(() => setVisible(false));
    }
  }, [open, rec]);

  const loadCollections = useCallback(async () => {
    if (!user || !rec) return;
    setLoading(true);
    setError(null);
    try {
      const cols = await CollectionsApi.myCollections();
      if (!cols.length) {
        setCollections([]);
        setLoading(false);
        return;
      }

      const colIds = cols.map((c) => c.id);
      const [{ data: allItems }, { data: existing }] = await Promise.all([
        Backend.from('user_collection_rexes').select('collection_id').in('collection_id', colIds),
        Backend.from('user_collection_rexes')
          .select('collection_id')
          .eq('rex_id', rec.id)
          .in('collection_id', colIds),
      ]);

      const countMap = new Map<string, number>();
      (allItems || []).forEach((i: any) =>
        countMap.set(i.collection_id, (countMap.get(i.collection_id) || 0) + 1),
      );

      const existingSet = new Set((existing || []).map((e: any) => e.collection_id as string));
      setCollections(
        cols.map((c) => ({
          ...c,
          item_count: countMap.get(c.id) || 0,
          alreadyHasRec: existingSet.has(c.id),
        })),
      );
    } catch {
      setError('Failed to load collections');
    }
    setLoading(false);
  }, [user, rec]);

  useEffect(() => {
    if (open && rec) {
      setAddedTo(null);
      setShowNewCollection(false);
      setNewName('');
      setError(null);
      loadCollections();
    }
  }, [open, rec, loadCollections]);

  const handleAdd = async (collectionId: string, collectionTitle: string) => {
    if (!user || !rec) return;
    try {
      await CollectionsApi.addRexToCollection({ collection_id: collectionId, rex_id: rec.id });
      setAddedTo(collectionId);
      toastSuccess(`Added to ${collectionTitle}`);
      setTimeout(onClose, 800);
    } catch {
      setError('Failed to add — tap to retry');
    }
  };

  const handleCreateAndAdd = async () => {
    if (!user || !rec || !newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const collection = await CollectionsApi.createCollection({ display_name: newName.trim() });
      await CollectionsApi.addRexToCollection({ collection_id: collection.id, rex_id: rec.id });
      toastSuccess(`Added to ${collection.display_name}`);
      setCreating(false);
      setTimeout(onClose, 800);
    } catch {
      setError('Failed to create collection');
      setCreating(false);
    }
  };

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

      <View style={styles.outer} pointerEvents="box-none">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
          style={{ width: '100%' }}
        >
          <Animated.View style={{ transform: [{ translateY: sheetTranslateY }] }}>
            <View
              style={{ maxHeight: height * 0.75 }}
              className="bg-card rounded-t-2xl border-t border-border flex flex-col"
            >
              {/* Handle bar */}
              <View style={webContainerStyle} className="items-center py-3">
                <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </View>

              {/* Heading */}
              <View style={[{ paddingHorizontal: 16, paddingBottom: 8 }, webContainerStyle]}>
                <Text className="text-base font-display font-medium text-foreground">
                  Add to collection
                </Text>
              </View>

              {/* Rex summary */}
              {rec && (
                <View style={[{ paddingHorizontal: 16, paddingBottom: 12 }, webContainerStyle]}>
                  <View className="flex-row items-center gap-2 flex-wrap">
                    <Text className="text-sm font-semibold text-foreground">{rec.place_name}</Text>
                    <View className="px-2 py-0.5 rounded-full bg-muted">
                      <Text className="text-[10px] font-medium text-muted-foreground capitalize">
                        {rec.category_code}
                      </Text>
                    </View>
                    {rec.location && (
                      <View className="flex-row items-center gap-0.5">
                        <MapPin size={10} color={Theme.colors.muted} />
                        <Text className="text-[11px] text-muted-foreground">{rec.location}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              <View className="h-px bg-border" style={webContainerStyle} />

              {/* Scrollable list */}
              <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[{ padding: 12, gap: 2 }, webContainerStyle]}
              >
                {error && (
                  <TouchableOpacity
                    onPress={loadCollections}
                    className="w-full flex-row items-center gap-2 p-3 rounded-xl mb-1"
                    style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
                  >
                    <AlertCircle size={16} color={Theme.colors.destructive} />
                    <Text className="flex-1 text-sm text-destructive">{error}</Text>
                    <Text className="text-xs font-medium text-destructive underline">Retry</Text>
                  </TouchableOpacity>
                )}

                {loading ? (
                  <View className="items-center justify-center py-8">
                    <ActivityIndicator color={Theme.colors.muted} />
                  </View>
                ) : collections.length === 0 && !error ? (
                  <Text className="text-sm text-muted-foreground text-center py-4">
                    You have no collections yet
                  </Text>
                ) : (
                  collections.map((c) => {
                    const isAdded = addedTo === c.id || c.alreadyHasRec;
                    const isJustAdded = addedTo === c.id;
                    return (
                      <CollectionRow
                        key={c.id}
                        col={c}
                        isAdded={isAdded}
                        isJustAdded={isJustAdded}
                        onPress={() => handleAdd(c.id, c.display_name)}
                      />
                    );
                  })
                )}
              </ScrollView>

              {/* Create new collection — pinned to bottom */}
              <View className="border-t border-border">
                <View style={[{ padding: 16 }, webContainerStyle]}>
                  {showNewCollection ? (
                    <View className="flex-row gap-2">
                      <TextInput
                        value={newName}
                        onChangeText={(v) => setNewName(v.slice(0, 60))}
                        placeholder="Collection name…"
                        placeholderTextColor={Theme.colors.muted}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleCreateAndAdd}
                        className="flex-1 px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground"
                      />
                      <TouchableOpacity
                        onPress={handleCreateAndAdd}
                        disabled={!newName.trim() || creating}
                        className={`px-4 rounded-lg bg-primary items-center justify-center ${!newName.trim() || creating ? 'opacity-50' : ''}`}
                      >
                        {creating ? (
                          <ActivityIndicator size="small" color={Theme.colors.primaryForeground} />
                        ) : (
                          <Text className="text-primary-foreground text-sm font-medium">
                            Create & add
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setShowNewCollection(true)}
                      activeOpacity={0.7}
                      className="w-full flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg border border-border"
                    >
                      <Plus size={14} color={Theme.colors.foreground} />
                      <Text className="text-sm font-medium text-foreground">
                        Create new collection
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  outer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  list: { flex: 1 },
});

export default AddToCollectionSheet;
