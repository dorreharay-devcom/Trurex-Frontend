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
  Easing,
} from 'react-native';
import {
  Plus,
  Check,
  Image as ImageIcon,
  AlertCircle,
  Trash2,
  Bookmark,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import { CollectionsApi, UserCollection } from '~/api/CollectionsApi';
import { useAuth } from '~/services/AuthContext';
import { toastError, toastSuccess, toastSuccessAfterDismiss } from '~/utils/appToast';
import { isWeb, webContainerStyle } from '~/utils';
import { cn } from '~/utils/general';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { unknownErrorMessage } from '~/utils';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/theme/Theme';
import { modalConfig } from '~/constants/recommendation/modalConfig';

const collectionFieldBg = { backgroundColor: Theme.colors.searchFieldBackground };
const SHEET_CHROME_HEIGHT = 220;

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
  onUnsaved?: () => void;
  onUnsaveFailed?: () => void;
  onSaveRexFailed?: () => void;
  onSaved?: () => void;
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
      style={selected ? { backgroundColor: Theme.colors.accent } : undefined}
      className="w-full flex-row items-center gap-3 rounded-xl p-3"
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
          className={cn(
            'text-xs font-medium',
            selected ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {selected ? 'In collection' : `${col.item_count} item${col.item_count !== 1 ? 's' : ''}`}
        </Text>
      </View>
      {selected && <Check size={18} color={Theme.colors.foreground} />}
    </TouchableOpacity>
  );
};

const AddToCollectionSheet: React.FC<AddToCollectionSheetProps> = ({
  open,
  rec,
  onClose,
  onRemove,
  onUnsaved,
  onUnsaveFailed,
  onSaveRexFailed,
  onSaved,
}) => {
  const { user } = useAuth();
  const { height } = useWindowDimensions();
  const queryClient = useQueryClient();

  const [visible, setVisible] = useState(false);
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [original, setOriginal] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [isRexSaved, setIsRexSaved] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [savingUncollected, setSavingUncollected] = useState(false);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(height)).current;
  const sheetMaxHeight = height * 0.75;
  const listMaxHeight = Math.max(sheetMaxHeight - SHEET_CHROME_HEIGHT, 160);
  const useNativeDriver = Platform.OS !== 'web';

  useEffect(() => {
    if (open && rec) {
      setVisible(true);
      sheetTranslateY.setValue(height);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: modalConfig.timing.sheetOpenMs,
          useNativeDriver,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: modalConfig.timing.sheetOpenMs,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
      ]).start();
    } else if (!open) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: modalConfig.timing.sheetCloseMs,
          useNativeDriver,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: height,
          duration: modalConfig.timing.sheetCloseMs,
          easing: Easing.in(Easing.cubic),
          useNativeDriver,
        }),
      ]).start(() => setVisible(false));
    }
  }, [open, rec, height, sheetTranslateY, backdropOpacity, useNativeDriver]);

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
      setRemoving(false);
      setSavingUncollected(false);
      setIsRexSaved(Boolean(rec.isSaved));
      loadCollections();
    }
  }, [open, rec, loadCollections]);

  const invalidateSavedQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['my-saved-ids'] });
    queryClient.invalidateQueries({ queryKey: ['my-saved'] });
    queryClient.invalidateQueries({ queryKey: ['my-saved-rexes'] });
    queryClient.invalidateQueries({ queryKey: ['discover-recommendations'] });
    queryClient.invalidateQueries({ queryKey: ['mapRexesInBounds'] });
    queryClient.invalidateQueries({ queryKey: ['mapRexPins'] });
  }, [queryClient]);

  const ensureRexSaved = useCallback(async () => {
    if (isRexSaved || !user || !rec) return;
    await CollectionsApi.saveRex(user.id, rec.id);
    setIsRexSaved(true);
    onSaved?.();
    invalidateSavedQueries();
  }, [isRexSaved, user, rec, onSaved, invalidateSavedQueries]);

  const handleSaveToUncollected = async () => {
    if (!user || !rec || isRexSaved || savingUncollected) return;
    setSavingUncollected(true);
    try {
      await ensureRexSaved();
      toastSuccess('Saved to uncollected');
    } catch (e: unknown) {
      if (didAccountFrozenMutationToast(e)) return;
      onSaveRexFailed?.();
      toastError('Failed to save', unknownErrorMessage(e, 'Try again.'));
    } finally {
      setSavingUncollected(false);
    }
  };

  const handleRemoveFromUncollected = async () => {
    if (!user || !rec || removing) return;
    setRemoving(true);
    onUnsaved?.();
    setIsRexSaved(false);
    try {
      await CollectionsApi.unsaveRex(user.id, rec.id);
      invalidateSavedQueries();
      onRemove?.();
      toastSuccess('Removed from saved');
    } catch (e: unknown) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not remove', unknownErrorMessage(e, 'Try again.'));
      setIsRexSaved(true);
      onUnsaveFailed?.();
    } finally {
      setRemoving(false);
    }
  };

  const toggleCollection = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDone = async () => {
    if (!rec) {
      onClose();
      return;
    }
    const toAdd = [...selected].filter((id) => !original.has(id));
    const toRemove = [...original].filter((id) => !selected.has(id));
    if (toAdd.length === 0 && toRemove.length === 0) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      if (toAdd.length > 0) {
        try {
          await ensureRexSaved();
        } catch (e: unknown) {
          if (didAccountFrozenMutationToast(e)) return;
          toastError('Failed to save', unknownErrorMessage(e, 'Try again.'));
          setSaving(false);
          return;
        }
      }
      await Promise.all([
        ...toAdd.map((id) =>
          CollectionsApi.addRexToCollection({ collection_id: id, rex_id: rec.id }),
        ),
        ...toRemove.map((id) =>
          CollectionsApi.removeRexFromCollection({ collection_id: id, rex_id: rec.id }),
        ),
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
      await ensureRexSaved();
      const collection = await CollectionsApi.createCollection({ display_name: newName.trim() });
      await CollectionsApi.addRexToCollection({ collection_id: collection.id, rex_id: rec.id });
      queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      setCreating(false);
      toastSuccessAfterDismiss(onClose, `Added to ${collection.display_name}`);
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
          behavior={
            Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'padding' : undefined
          }
          pointerEvents="box-none"
          style={{ width: '100%' }}
        >
          <Animated.View style={{ width: '100%', transform: [{ translateY: sheetTranslateY }] }}>
            <View
              style={{ maxHeight: sheetMaxHeight }}
              className="w-full bg-card rounded-t-2xl border-t border-border"
            >
              <View className="w-full items-center py-3">
                <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </View>

              <View className="w-full flex-row items-center justify-between px-4 pb-4">
                <Text className="text-base font-display font-medium text-foreground">
                  Add to collection
                </Text>
                <TouchableOpacity onPress={handleDone} activeOpacity={0.7} disabled={saving}>
                  {saving ? (
                    <ActivityIndicator size="small" color={Theme.colors.primary} />
                  ) : (
                    <Text className="text-sm font-semibold text-foreground">Done</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View className="h-px w-full bg-border" />

              <ScrollView
                style={{ maxHeight: listMaxHeight }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[{ padding: 12, gap: 2, minHeight: 160 }, webContainerStyle]}
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
                        className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm text-foreground"
                        style={[
                          collectionFieldBg,
                          textFieldCaretStyle,
                          textFieldSingleLineStyle,
                          textFieldSingleLineDefaultHeightStyle,
                        ]}
                      />
                      <Pressable
                        onPress={() => {
                          if (!newName.trim() || creating) return;
                          void handleCreateAndAdd();
                        }}
                        disabled={!newName.trim() || creating}
                        style={
                          (!newName.trim() || creating) && isWeb
                            ? ({ cursor: 'not-allowed' } as const)
                            : undefined
                        }
                        className={cn(
                          'items-center justify-center rounded-lg px-4',
                          newName.trim() && !creating
                            ? 'cursor-pointer bg-primary active:opacity-90'
                            : 'cursor-not-allowed bg-primary/40 opacity-50',
                        )}
                      >
                        {creating ? (
                          <ActivityIndicator size="small" color={Theme.colors.primaryForeground} />
                        ) : (
                          <Text className="text-sm font-medium text-primary-foreground">
                            Create & add
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  ) : (
                    <View className="gap-2">
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

                      {isRexSaved ? null : (
                        <TouchableOpacity
                          onPress={() => void handleSaveToUncollected()}
                          activeOpacity={0.7}
                          disabled={savingUncollected}
                          className="w-full flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg border border-border"
                        >
                          {savingUncollected ? (
                            <ActivityIndicator size="small" color={Theme.colors.foreground} />
                          ) : (
                            <>
                              <Bookmark size={14} color={Theme.colors.foreground} />
                              <Text className="text-sm font-medium text-foreground">
                                Save to uncollected
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      )}

                      {isRexSaved ? (
                        <TouchableOpacity
                          onPress={() => void handleRemoveFromUncollected()}
                          activeOpacity={0.7}
                          disabled={removing}
                          className="w-full flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg border border-destructive"
                        >
                          {removing ? (
                            <ActivityIndicator size="small" color={Theme.colors.destructive} />
                          ) : (
                            <>
                              <Trash2 size={14} color={Theme.colors.destructive} />
                              <Text className="text-sm font-medium text-destructive">
                                Remove from uncollected
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      ) : null}
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
});

export default AddToCollectionSheet;
