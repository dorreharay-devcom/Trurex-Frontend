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
import { Plus, Check, Image as ImageIcon, AlertCircle } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import { CollectionsApi, UserCollection } from '~/api/CollectionsApi';
import { useAuth } from '~/services/AuthContext';
import { toastSuccess, toastError } from '~/utils/appToast';
import { webContainerStyle } from '~/utils';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { unknownErrorMessage } from '~/utils';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { Theme } from '~/theme/Theme';

export interface RecSummary {
  id: string;
  place_name: string;
  category_code: string;
  location?: string;
  isSaved?: boolean | null;
}

interface CollectionWithCount extends UserCollection {
  item_count: number;
}

export interface AddToCollectionSheetProps {
  open: boolean;
  rec: RecSummary | null;
  onClose: () => void;
  onRemove?: () => void;
}

const CollectionRow: React.FC<{
  col: CollectionWithCount;
  selected: boolean;
  onPress: () => void;
}> = ({ col, selected, onPress }) => {
  const { uri: coverUri } = useSignedStorageUrl(REX_IMAGES_BUCKET, col.cover_image_path ?? '');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={selected ? { backgroundColor: `${Theme.colors.primary}14` } : undefined}
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
        <Text
          className="text-xs font-medium"
          style={{ color: selected ? Theme.colors.primary : Theme.colors.muted }}
        >
          {selected ? 'In collection' : `${col.item_count} item${col.item_count !== 1 ? 's' : ''}`}
        </Text>
      </View>
      {selected && <Check size={18} color={Theme.colors.primary} />}
    </TouchableOpacity>
  );
};

const AddToCollectionSheet: React.FC<AddToCollectionSheetProps> = ({ open, rec, onClose, onRemove }) => {
  const { user } = useAuth();
  const { height } = useWindowDimensions();
  const queryClient = useQueryClient();

  const [visible, setVisible] = useState(false);
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [original, setOriginal] = useState<Set<string>>(new Set());
  const [isInAnyCollection, setIsInAnyCollection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const suppressSaveToast = useRef(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (open && rec) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(sheetTranslateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
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
      const [cols, existingIds] = await Promise.all([
        CollectionsApi.userCollections(user.id),
        CollectionsApi.myCollectionIdsForRex(rec.id),
      ]);
      const existingSet = new Set(existingIds);
      setOriginal(existingSet);
      setSelected(new Set(existingSet));
      setIsInAnyCollection(existingIds.length > 0);
      setCollections(cols.map((c) => ({ ...c, item_count: c.rex_count ?? 0 })));
    } catch {
      setError('Failed to load collections');
    }
    setLoading(false);
  }, [user, rec]);

  useEffect(() => {
    if (open && rec) {
      setSelected(new Set());
      setOriginal(new Set());
      setShowNewCollection(false);
      setNewName('');
      setError(null);
      loadCollections();

      if (!rec.isSaved) {
        suppressSaveToast.current = false;
        CollectionsApi.saveRex(user!.id, rec.id)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ['my-saved-ids'] });
            queryClient.invalidateQueries({ queryKey: ['my-saved'] });
            if (!suppressSaveToast.current) toastSuccess('Saved to uncollected');
          })
          .catch((e: unknown) => {
            if (didAccountFrozenMutationToast(e)) return;
            toastError(unknownErrorMessage(e, 'Failed to save'));
            onClose();
          });
      }
    }
  }, [open, rec, loadCollections]);

  const toggleCollection = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDone = async () => {
    if (!rec) { onClose(); return; }
    const toAdd = [...selected].filter((id) => !original.has(id));
    const toRemove = [...original].filter((id) => !selected.has(id));
    if (toAdd.length === 0 && toRemove.length === 0) { onClose(); return; }

    setSaving(true);
    try {
      await Promise.all([
        ...toAdd.map((id) => CollectionsApi.addRexToCollection({ collection_id: id, rex_id: rec.id })),
        ...toRemove.map((id) => CollectionsApi.removeRexFromCollection({ collection_id: id, rex_id: rec.id })),
      ]);
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection-detail'] });
      queryClient.invalidateQueries({ queryKey: ['my-saved-rexes'] });
    } catch (e: unknown) {
      if (!didAccountFrozenMutationToast(e)) {
        toastError('Failed to update collections');
      }
    }
    setSaving(false);
    onClose();
  };

  const handleCreateAndAdd = async () => {
    if (!user || !rec || !newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const collection = await CollectionsApi.createCollection({ display_name: newName.trim() });
      await CollectionsApi.addRexToCollection({ collection_id: collection.id, rex_id: rec.id });
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      toastSuccess(`Added to ${collection.display_name}`);
      setCreating(false);
      onClose();
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
              <View style={webContainerStyle} className="items-center py-3">
                <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </View>

              <View style={[{ paddingHorizontal: 16, paddingBottom: 16 }, webContainerStyle]} className="flex-row items-center justify-between">
                <Text className="text-base font-display font-medium text-foreground">
                  Add to collection
                </Text>
                <TouchableOpacity onPress={handleDone} activeOpacity={0.7} disabled={saving}>
                  {saving ? (
                    <ActivityIndicator size="small" color={Theme.colors.primary} />
                  ) : (
                    <Text className="text-sm font-semibold text-primary">Done</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View className="h-px bg-border" style={webContainerStyle} />

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
                  collections.map((c) => (
                    <CollectionRow
                      key={c.id}
                      col={c}
                      selected={selected.has(c.id)}
                      onPress={() => toggleCollection(c.id)}
                    />
                  ))
                )}
              </ScrollView>

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
                    <View className="gap-2">
                      <TouchableOpacity
                        onPress={() => setShowNewCollection(true)}
                        activeOpacity={0.7}
                        className="w-full flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg border border-border"
                      >
                        <Plus size={14} color={Theme.colors.foreground} />
                        <Text className="text-sm font-medium text-foreground">Create new collection</Text>
                      </TouchableOpacity>

                      {onRemove && !isInAnyCollection && (
                        <TouchableOpacity
                          onPress={() => {
                            suppressSaveToast.current = true;
                            onRemove();
                          }}
                          activeOpacity={0.7}
                          className="w-full flex-row items-center justify-center py-2.5 rounded-lg"
                        >
                          <Text className="text-sm font-medium text-destructive">Remove from uncollected</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
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
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  outer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  list: { flex: 1 },
});

export default AddToCollectionSheet;