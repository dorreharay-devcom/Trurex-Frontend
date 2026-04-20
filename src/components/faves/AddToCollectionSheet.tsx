import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { Plus, Check, AlertCircle, MapPin, Image as ImageIcon } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Backend } from '~/services/AuthService';
import { CollectionsApi, UserCollection } from '~/api/CollectionsApi';
import { useAuth } from '~/services/AuthContext';
import { toastSuccess, toastError } from '~/utils/appToast';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { Theme } from '~/theme/Theme';

export interface RecSummary {
  id: string;
  place_name: string;
  category_code: string;
  location?: string;
}

interface CollectionWithStatus extends UserCollection {
  item_count: number;
  alreadyHasRec: boolean;
}

export interface AddToCollectionSheetProps {
  open: boolean;
  rec: RecSummary | null;
  onClose: () => void;
}

const CollectionRow: React.FC<{
  col: CollectionWithStatus;
  isJustAdded: boolean;
  onPress: () => void;
}> = ({ col, isJustAdded, onPress }) => {
  const { uri: coverUri } = useSignedStorageUrl(REX_IMAGES_BUCKET, col.cover_image_path ?? '');
  const isAdded = col.alreadyHasRec || isJustAdded;

  return (
    <TouchableOpacity
      onPress={isAdded ? undefined : onPress}
      disabled={isAdded}
      activeOpacity={0.7}
      className={`flex-row items-center gap-3 p-3 rounded-xl ${isAdded ? 'opacity-60' : ''}`}
    >
      <View className="w-10 h-10 rounded-lg bg-muted overflow-hidden items-center justify-center shrink-0">
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={{ width: 40, height: 40 }} contentFit="cover" />
        ) : (
          <ImageIcon size={16} color={Theme.colors.muted} />
        )}
      </View>

      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {col.display_name}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {isAdded && !isJustAdded
            ? 'Already added'
            : `${col.item_count} rec${col.item_count !== 1 ? 's' : ''}`}
        </Text>
      </View>

      {isAdded && <Check size={18} color={Theme.colors.primary} />}
    </TouchableOpacity>
  );
};

const AddToCollectionSheet: React.FC<AddToCollectionSheetProps> = ({ open, rec, onClose }) => {
  const { user } = useAuth();
  const { height } = useWindowDimensions();

  const [collections, setCollections] = useState<CollectionWithStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedTo, setAddedTo] = useState<string | null>(null);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

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
      (allItems || []).forEach((i: any) => {
        countMap.set(i.collection_id, (countMap.get(i.collection_id) || 0) + 1);
      });

      const existingSet = new Set((existing || []).map((e: any) => e.collection_id));

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
    } catch (e: any) {
      toastError('Failed to add', e?.message);
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
    } catch (e: any) {
      setError('Failed to create collection');
      setCreating(false);
    }
  };

  return (
    <Modal
      visible={open && !!rec}
      transparent
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={onClose}
    >
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.outer}
        pointerEvents="box-none"
      >
        <View
          style={{ maxHeight: height * 0.75 }}
          className="bg-card rounded-t-2xl border-t border-border flex flex-col"
        >
          {/* Handle */}
          <View className="items-center py-3">
            <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </View>

          {/* Title */}
          <View className="px-4 pb-3">
            <Text className="text-base font-display font-medium text-foreground">
              Add to collection
            </Text>
          </View>

          {/* Rex pill */}
          {rec && (
            <View className="px-4 pb-3 flex-row items-center flex-wrap gap-2">
              <Text className="text-sm font-semibold text-foreground">{rec.place_name}</Text>
              <View className="bg-muted rounded-full px-2 py-0.5">
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
          )}

          <View className="h-px bg-border mx-4" />

          {/* List */}
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {error && (
              <TouchableOpacity
                onPress={loadCollections}
                className="flex-row items-center gap-2 p-3 m-3 rounded-xl bg-destructive/10"
              >
                <AlertCircle size={16} color={Theme.colors.destructive} />
                <Text className="flex-1 text-sm text-destructive">{error}</Text>
                <Text className="text-xs font-medium text-destructive">Retry</Text>
              </TouchableOpacity>
            )}

            {loading ? (
              <View className="px-4 py-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <View key={i} className="flex-row items-center gap-3 p-3">
                    <View className="w-10 h-10 rounded-lg bg-muted" />
                    <View className="flex-1 gap-1.5">
                      <View className="h-3.5 w-28 bg-muted rounded" />
                      <View className="h-3 w-16 bg-muted rounded" />
                    </View>
                  </View>
                ))}
              </View>
            ) : collections.length === 0 && !error ? (
              <Text className="text-sm text-muted-foreground text-center py-6">
                You have no collections yet
              </Text>
            ) : (
              <View className="px-4 py-3 gap-1">
                {collections.map((c) => (
                  <CollectionRow
                    key={c.id}
                    col={c}
                    isJustAdded={addedTo === c.id}
                    onPress={() => handleAdd(c.id, c.display_name)}
                  />
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View className="px-4 pb-4 pt-2 border-t border-border">
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
                  className={`px-4 py-2.5 rounded-lg bg-primary items-center justify-center ${!newName.trim() || creating ? 'opacity-50' : ''}`}
                >
                  {creating ? (
                    <ActivityIndicator size="small" color={Theme.colors.primaryForeground} />
                  ) : (
                    <Text className="text-primary-foreground text-sm font-medium">Create & add</Text>
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
                <Text className="text-sm font-medium text-foreground">Create new collection</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  outer: { flex: 1, justifyContent: 'flex-end' },
  list: { flex: 1 },
});

export default AddToCollectionSheet;
