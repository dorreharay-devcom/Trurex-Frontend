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
import { Bookmark, Plus, X, Check, Image as ImageIcon } from 'lucide-react-native';
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

interface CollectionWithCount extends UserCollection {
  item_count: number;
}

export interface AddToCollectionSheetProps {
  open: boolean;
  rec: RecSummary | null;
  onClose: () => void;
}

const Checkbox = ({ checked }: { checked: boolean }) => (
  <View
    className={`w-5 h-5 rounded border-2 items-center justify-center ${
      checked ? 'bg-primary border-primary' : 'border-border bg-transparent'
    }`}
  >
    {checked && <Check size={12} color={Theme.colors.primaryForeground} strokeWidth={3} />}
  </View>
);

const CollectionRow: React.FC<{
  col: CollectionWithCount;
  checked: boolean;
  onPress: () => void;
}> = ({ col, checked, onPress }) => {
  const { uri: coverUri } = useSignedStorageUrl(REX_IMAGES_BUCKET, col.cover_image_path ?? '');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-full flex-row items-center gap-3 p-3 rounded-xl"
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
          {col.item_count} item{col.item_count !== 1 ? 's' : ''}
        </Text>
      </View>
      <Checkbox checked={checked} />
    </TouchableOpacity>
  );
};

const AddToCollectionSheet: React.FC<AddToCollectionSheetProps> = ({ open, rec, onClose }) => {
  const { user } = useAuth();
  const { height } = useWindowDimensions();

  const [visible, setVisible] = useState(false);
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [savedIn, setSavedIn] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
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

      setSavedIn(new Set((existing || []).map((e: any) => e.collection_id)));
      setCollections(cols.map((c) => ({ ...c, item_count: countMap.get(c.id) || 0 })));
    } catch {
      toastError('Failed to load collections');
    }
    setLoading(false);
  }, [user, rec]);

  useEffect(() => {
    if (open && rec) {
      setShowNewCollection(false);
      setNewName('');
      loadCollections();
    }
  }, [open, rec, loadCollections]);

  const toggleCollection = async (collectionId: string, collectionTitle: string) => {
    if (!user || !rec) return;
    const isCurrentlySaved = savedIn.has(collectionId);

    setSavedIn((prev) => {
      const next = new Set(prev);
      isCurrentlySaved ? next.delete(collectionId) : next.add(collectionId);
      return next;
    });

    try {
      if (isCurrentlySaved) {
        const { error } = await Backend.from('user_collection_rexes')
          .delete()
          .eq('collection_id', collectionId)
          .eq('rex_id', rec.id);
        if (error) throw error;
        toastSuccess(`Removed from ${collectionTitle}`);
      } else {
        await CollectionsApi.addRexToCollection({ collection_id: collectionId, rex_id: rec.id });
        toastSuccess(`Saved to ${collectionTitle}`);
      }
    } catch {
      setSavedIn((prev) => {
        const next = new Set(prev);
        isCurrentlySaved ? next.add(collectionId) : next.delete(collectionId);
        return next;
      });
      toastError(isCurrentlySaved ? 'Failed to remove' : 'Failed to save');
    }
  };

  const handleCreateAndAdd = async () => {
    if (!user || !rec || !newName.trim()) return;
    setCreating(true);
    try {
      const collection = await CollectionsApi.createCollection({ display_name: newName.trim() });
      await CollectionsApi.addRexToCollection({ collection_id: collection.id, rex_id: rec.id });
      setCollections((prev) => [{ ...collection, item_count: 1 }, ...prev]);
      setSavedIn((prev) => new Set(prev).add(collection.id));
      toastSuccess(`Saved to ${collection.display_name}`);
      setNewName('');
      setShowNewCollection(false);
    } catch {
      toastError('Failed to create collection');
    }
    setCreating(false);
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
              style={{ maxHeight: height * 0.7 }}
              className="bg-card rounded-t-2xl border-t border-border flex flex-col"
            >
              {/* Header */}
              <View className="flex-row items-center justify-between p-4 border-b border-border">
                <View className="flex-row items-center gap-2">
                  <Bookmark size={18} color={Theme.colors.primary} />
                  <Text className="font-display font-bold text-foreground text-base">
                    Save to Gems
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <X size={18} color={Theme.colors.muted} />
                </TouchableOpacity>
              </View>

              {/* Scrollable content */}
              <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerClassName="p-4 gap-1"
              >
                {/* Create new collection */}
                {showNewCollection ? (
                  <View className="flex-row gap-2 p-2">
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
                      className={`w-10 rounded-lg bg-primary items-center justify-center ${!newName.trim() || creating ? 'opacity-50' : ''}`}
                    >
                      {creating ? (
                        <ActivityIndicator size="small" color={Theme.colors.primaryForeground} />
                      ) : (
                        <Check size={16} color={Theme.colors.primaryForeground} />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowNewCollection(false);
                        setNewName('');
                      }}
                      className="w-10 rounded-lg items-center justify-center"
                    >
                      <X size={16} color={Theme.colors.muted} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => setShowNewCollection(true)}
                    activeOpacity={0.7}
                    className="w-full flex-row items-center gap-3 p-3 rounded-xl"
                  >
                    <View className="w-10 h-10 rounded-lg bg-muted items-center justify-center border border-dashed border-border">
                      <Plus size={18} color={Theme.colors.muted} />
                    </View>
                    <Text className="text-sm font-semibold text-foreground">
                      + Create new collection
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Divider */}
                {collections.length > 0 && (
                  <View className="flex-row items-center gap-2 py-2 px-1">
                    <View className="flex-1 h-px bg-border" />
                    <Text className="text-[10px] text-muted-foreground font-medium">
                      YOUR COLLECTIONS
                    </Text>
                    <View className="flex-1 h-px bg-border" />
                  </View>
                )}

                {loading ? (
                  <View className="items-center justify-center py-8">
                    <ActivityIndicator color={Theme.colors.muted} />
                  </View>
                ) : collections.length === 0 ? (
                  <Text className="text-sm text-muted-foreground text-center py-6">
                    No collections yet. Create one above!
                  </Text>
                ) : (
                  collections.map((c) => (
                    <CollectionRow
                      key={c.id}
                      col={c}
                      checked={savedIn.has(c.id)}
                      onPress={() => toggleCollection(c.id, c.display_name)}
                    />
                  ))
                )}
              </ScrollView>

              {/* Done button */}
              <View className="p-4 border-t border-border">
                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.8}
                  className="w-full py-3 rounded-xl bg-primary items-center"
                >
                  <Text className="text-primary-foreground font-semibold text-sm">Done</Text>
                </TouchableOpacity>
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
