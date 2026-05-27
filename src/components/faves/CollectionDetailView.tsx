import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Trash2,
  Pencil,
  Share2,
  BookmarkPlus,
  BookmarkMinus,
  MapPin,
  Star,
  DollarSign,
  X,
  StickyNote,
  Lock,
  Globe,
  Link2,
} from 'lucide-react-native';
import { webContainerStyle } from '~/utils';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/theme/Theme';
import {
  useCollectionDetail,
  useRemoveRexFromCollection,
  useDeleteCollection,
  useSaveCollection,
  useUnsaveCollection,
  useUpdateCollectionRexNote,
} from '~/hooks/useCollections';
import EditCollectionModal from '~/components/faves/EditCollectionModal';
import { toastSuccessAfterDismiss } from '~/utils/appToast';
import { RexCoverThumbnail } from '~/components/common/RexCoverThumbnail';
import type {
  Recommendation,
  RecommendationOpenOptions,
} from '~/types/recommendation/recommendation';
import type { CollectionRexEntry } from '~/api/CollectionsApi';
import AddToCollectionSheet, { RecSummary } from '~/components/faves/AddToCollectionSheet';
import { DestructiveActionConfirmModal } from '~/components/common/DestructiveActionConfirmModal';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';

const VALUE_LABELS = ['Total Steal', 'Budget-Friendly', 'Good Value', 'Worth It', 'Splurge'];

function entryToRec(entry: CollectionRexEntry): Recommendation {
  return {
    id: entry.rex_id,
    title: entry.place_name,
    categoryId: entry.category_code,
    category: entry.category_name ?? entry.category_code,
    photoPath: entry.photo_path,
    rexPlaceholderHtml: entry.rex_placeholder_html?.trim() || null,
    location: entry.location ?? undefined,
    rating: entry.rating ?? undefined,
    scoreValueForMoney: entry.score_value_for_money ?? undefined,
    user:
      entry.recommender_name || entry.recommender_handle
        ? { name: entry.recommender_name ?? '', handle: entry.recommender_handle ?? '', avatar: '' }
        : null,
    timeAgo: '',
    likes: 0,
    comments: 0,
    saves: 0,
    isLiked: false,
    isSaved: true,
  };
}

export interface CollectionDetailViewProps {
  collectionId: string;
  onBack: () => void;
  onAddItem: (collectionId: string) => void;
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
}

const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({
  collectionId,
  onBack,
  onAddItem,
  onRecommendationPress,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const { data: detail, isLoading } = useCollectionDetail(collectionId);
  const [saveTarget, setSaveTarget] = useState<RecSummary | null>(null);

  const removeMutation = useRemoveRexFromCollection(collectionId);
  const deleteMutation = useDeleteCollection();
  const { mutate: save } = useSaveCollection();
  const { mutate: unsave, isPending: unsaving } = useUnsaveCollection();
  const updateNote = useUpdateCollectionRexNote(collectionId);

  const [noteItemId, setNoteItemId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const openNoteEditor = (rexId: string, existing: string | null | undefined) => {
    setNoteItemId(rexId);
    setNoteText(existing ?? '');
  };
  const closeNoteEditor = () => {
    setNoteItemId(null);
    setNoteText('');
  };
  const saveNote = (rexId: string) => {
    updateNote.mutate({ rex_id: rexId, note: noteText.trim() || null });
    closeNoteEditor();
  };

  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnsaveConfirm, setShowUnsaveConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const isSaved = savedOverride ?? detail?.is_saved ?? false;

  const collectionShareUrl = () => {
    const base =
      typeof window !== 'undefined' ? window.location.origin : 'https://trurex.netlify.app';
    return `${base}/collection/${collectionId}`;
  };

  const handleShareCollection = async () => {
    const url = collectionShareUrl();
    if (Platform.OS === 'web') {
      await Clipboard.setStringAsync(url);
      toastSuccessAfterDismiss(() => setShowMenu(false), 'Link copied!');
      return;
    }

    setShowMenu(false);
    setTimeout(() => {
      void Share.share({
        title: detail.display_name,
        message: `Check out "${detail.display_name}" on TruRex\n${url}`,
        url,
      });
    }, 120);
  };
  const menuButtonRef = useRef<View>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  if (isLoading || !detail) {
    return (
      <View className="px-4 pt-4" style={webContainerStyle}>
        <ActivityIndicator className="mt-6" color={Theme.colors.primary} />
      </View>
    );
  }

  const ListHeader = (
    <View style={webContainerStyle} className="px-4 pt-1">
      <Text className="text-xl font-bold text-foreground">{detail.display_name}</Text>
      {detail.description && (
        <Text className="text-sm text-muted-foreground mt-1">{detail.description}</Text>
      )}
      <View className="flex-row items-center gap-3 mt-2">
        {detail.visibility &&
          (() => {
            const cfg =
              detail.visibility === 'public'
                ? { Icon: Globe, label: 'Public' }
                : detail.visibility === 'shared'
                  ? { Icon: Link2, label: 'Shared' }
                  : { Icon: Lock, label: 'Private' };
            return (
              <View className="flex-row items-center gap-1">
                <cfg.Icon size={12} color={Theme.colors.muted} />
                <Text className="text-xs text-muted-foreground">{cfg.label}</Text>
              </View>
            );
          })()}
        <Text className="text-xs text-muted-foreground">
          {detail.rexes.length} rex{detail.rexes.length !== 1 ? 'es' : ''}
        </Text>
      </View>

      {detail.is_my_collection ? (
        <Pressable
          onPress={() => onAddItem(collectionId)}
          accessibilityRole="button"
          accessibilityLabel="Add to collection"
          className="my-4 h-12 w-full flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border active:opacity-80"
        >
          <View pointerEvents="none" className="flex-row items-center justify-center gap-2">
            <Plus size={16} color={Theme.colors.muted} />
            <Text className="text-sm font-medium text-muted-foreground">Add to Collection</Text>
          </View>
        </Pressable>
      ) : (
        <View className="h-px bg-border my-4" />
      )}
    </View>
  );

  return (
    <>
      <View className="w-full flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={onBack} className="flex-row items-center gap-1">
          <ArrowLeft size={16} color={Theme.colors.muted} />
          <Text className="text-sm text-muted-foreground">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          ref={menuButtonRef}
          onPress={() => {
            menuButtonRef.current?.measure(
              (
                _x: number,
                _y: number,
                width: number,
                height: number,
                pageX: number,
                pageY: number,
              ) => {
                setMenuPos({ top: pageY + height + 4, right: screenWidth - pageX - width });
              },
            );
            setShowMenu((v) => !v);
          }}
          className="p-2"
        >
          <MoreVertical size={18} color={Theme.colors.muted} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={detail.rexes}
        keyExtractor={(item) => item.rex_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="pb-24"
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View className="items-center py-12 gap-1 px-4">
            <Text className="text-3xl mb-1">📦</Text>
            <Text className="text-base font-semibold text-foreground text-center">
              Your collection is ready
            </Text>
            <Text className="text-sm text-muted-foreground text-center">
              Start adding recommendations.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-4 mb-3">
            <View className="bg-card border border-border rounded-xl overflow-hidden">
              <View className="flex-row">
                <Pressable
                  onPress={() => onRecommendationPress?.(entryToRec(item))}
                  className="flex-1 flex-row gap-3 p-3"
                >
                  <RexCoverThumbnail
                    rec={entryToRec(item)}
                    className="h-16 w-16 rounded-lg flex-shrink-0"
                  />
                  <View className="flex-1 min-w-0">
                    <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                      {item.place_name}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {item.category_name || item.category_code}
                    </Text>
                    <View className="mt-1 min-w-0 flex-row items-center gap-2 overflow-hidden">
                      {item.location && (
                        <View className="min-w-0 flex-1 flex-row items-center gap-0.5 overflow-hidden">
                          <MapPin size={10} color={Theme.colors.muted} style={{ flexShrink: 0 }} />
                          <Text
                            className="min-w-0 flex-1 text-[11px] text-muted-foreground"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.location}
                          </Text>
                        </View>
                      )}
                      {!!item.rating && (
                        <View className="flex-row items-center gap-0.5">
                          <Star
                            size={10}
                            color={Theme.colors.ratingStar}
                            fill={Theme.colors.ratingStar}
                          />
                          <Text className="text-[11px] text-muted-foreground">{item.rating}</Text>
                        </View>
                      )}
                      {!!item.score_value_for_money && (
                        <View className="flex-row items-center gap-0.5">
                          <DollarSign size={10} color={Theme.colors.muted} />
                          <Text className="text-[11px] text-muted-foreground">
                            {VALUE_LABELS[(item.score_value_for_money ?? 1) - 1]}
                          </Text>
                        </View>
                      )}
                    </View>
                    {item.recommender_name && (
                      <Text className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                        Rec'd by {item.recommender_name}
                      </Text>
                    )}
                  </View>
                </Pressable>
                <View className="flex-col items-center justify-center px-2 gap-2">
                  {detail.is_my_collection && (
                    <Pressable
                      onPress={() => openNoteEditor(item.rex_id, item.note)}
                      className="p-1"
                    >
                      <StickyNote
                        size={15}
                        color={item.note ? Theme.colors.primary : Theme.colors.muted}
                        fill={item.note ? Theme.colors.primary : 'transparent'}
                      />
                    </Pressable>
                  )}
                  {detail.is_my_collection && (
                    <Pressable onPress={() => removeMutation.mutate(item.rex_id)} className="p-1">
                      {({ hovered, pressed }: { hovered?: boolean; pressed?: boolean }) => (
                        <View
                          className={`w-6 h-6 rounded-full items-center justify-center ${hovered || pressed ? 'bg-destructive/10' : ''}`}
                        >
                          <X
                            size={12}
                            color={
                              hovered || pressed
                                ? Theme.colors.destructive
                                : Theme.colors.foreground
                            }
                          />
                        </View>
                      )}
                    </Pressable>
                  )}
                </View>
              </View>

              {item.note && noteItemId !== item.rex_id && (
                <View className="mx-3 mb-3 flex-row items-start gap-1.5 bg-muted/50 rounded-lg px-2.5 py-1.5">
                  <Text className="text-xs text-muted-foreground">💬</Text>
                  <Text className="text-xs text-muted-foreground italic flex-1">{item.note}</Text>
                </View>
              )}

              {noteItemId === item.rex_id && (
                <View className="mx-3 mb-3">
                  <TextInput
                    value={noteText}
                    onChangeText={(t) => setNoteText(t.slice(0, 140))}
                    placeholder="Add a personal note…"
                    placeholderTextColor={Theme.colors.muted}
                    multiline
                    maxLength={140}
                    className="min-h-[56px] rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-foreground"
                    style={[textFieldCaretStyle, textFieldMultilineStyle]}
                  />
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-[10px] text-muted-foreground">{noteText.length}/140</Text>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={closeNoteEditor}
                        className="rounded-lg border border-border bg-card px-3 py-1.5"
                      >
                        <Text className="text-xs font-medium text-foreground">Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => saveNote(item.rex_id)}
                        className="px-3 py-1.5 rounded-lg bg-primary"
                      >
                        <Text className="text-xs font-medium text-primary-foreground">Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      />

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
          onPress={() => setShowMenu(false)}
        />
        <View
          style={{
            position: 'absolute',
            top: menuPos.top,
            right: menuPos.right,
            minWidth: 200,
            zIndex: 2,
            elevation: 8,
          }}
          className="bg-card border border-border rounded-xl shadow-lg p-2"
        >
          {detail.is_my_collection ? (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setShowEdit(true);
                  setShowMenu(false);
                }}
                className="flex-row items-center gap-3 mx-1 px-3 py-2.5 rounded-md hover:bg-zinc-100"
              >
                <Pencil size={15} color={Theme.colors.foreground} />
                <Text className="text-sm text-foreground">Edit details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleShareCollection}
                className="flex-row items-center gap-3 mx-1 px-3 py-2.5 rounded-md hover:bg-zinc-100"
              >
                <Share2 size={15} color={Theme.colors.foreground} />
                <Text className="text-sm text-foreground">Share collection</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setShowDeleteConfirm(true);
                  setShowMenu(false);
                }}
                className="flex-row items-center gap-3 mx-1 px-3 py-2.5 rounded-md hover:bg-zinc-100"
              >
                <Trash2 size={15} color={Theme.colors.destructive} />
                <Text className="text-sm text-destructive">Delete collection</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleShareCollection}
                className="flex-row items-center gap-3 mx-1 px-3 py-2.5 rounded-md hover:bg-zinc-100"
              >
                <Share2 size={15} color={Theme.colors.foreground} />
                <Text className="text-sm text-foreground">Share collection</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setShowMenu(false);
                  if (isSaved) {
                    setShowUnsaveConfirm(true);
                    return;
                  }
                  const next = true;
                  setSavedOverride(next);
                  save(collectionId, { onError: () => setSavedOverride(false) });
                }}
                className={`flex-row items-center gap-3 mx-1 px-3 py-2.5 rounded-md ${isSaved ? 'hover:bg-zinc-100' : 'hover:bg-zinc-100'}`}
              >
                {isSaved ? (
                  <BookmarkMinus size={15} color={Theme.colors.destructive} />
                ) : (
                  <BookmarkPlus size={15} color={Theme.colors.foreground} />
                )}
                <Text className={`text-sm ${isSaved ? 'text-destructive' : 'text-foreground'}`}>
                  {isSaved ? 'Remove from saved' : 'Save to my collections'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <ModalToastLayer />
      </Modal>

      <EditCollectionModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onUpdated={() => setShowEdit(false)}
        collection={{
          id: collectionId,
          display_name: detail.display_name,
          description: detail.description ?? null,
          cover_image_path: detail.cover_image_path ?? null,
          visibility: detail.visibility,
        }}
      />

      <DestructiveActionConfirmModal
        visible={showDeleteConfirm}
        title="Delete collection?"
        message={`"${detail.display_name}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        pending={deleteMutation.isPending}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteMutation.mutate(collectionId, { onSuccess: onBack })}
      />

      <DestructiveActionConfirmModal
        visible={showUnsaveConfirm}
        title="Remove from saved?"
        message={`"${detail.display_name}" will be removed from your saved collections. You can save it again anytime.`}
        confirmLabel="Remove"
        icon={<BookmarkMinus size={22} color={Theme.colors.destructive} />}
        pending={unsaving}
        onCancel={() => setShowUnsaveConfirm(false)}
        onConfirm={() =>
          unsave(collectionId, {
            onSuccess: () => {
              setShowUnsaveConfirm(false);
              setSavedOverride(false);
              onBack();
            },
          })
        }
      />

      <AddToCollectionSheet
        open={!!saveTarget}
        rec={saveTarget}
        onClose={() => setSaveTarget(null)}
      />
    </>
  );
};

export default CollectionDetailView;
