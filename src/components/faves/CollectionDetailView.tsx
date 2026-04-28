import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ArrowLeft, Plus, MoreVertical, Trash2, Pencil, Link, BookmarkPlus, BookmarkMinus } from 'lucide-react-native';
import { Image } from 'expo-image';
import ImageColors from 'react-native-image-colors';
import { isWeb, webContainerStyle } from '~/utils';
import { Theme } from '~/theme/Theme';
import {
  useCollectionDetail,
  useRemoveRexFromCollection,
  useDeleteCollection,
  useSaveCollection,
  useUnsaveCollection,
} from '~/hooks/useCollections';
import EditCollectionModal from '~/components/faves/EditCollectionModal';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { toastSuccess } from '~/utils/appToast';
import RecommendationCard from '~/components/recommendation/RecommendationCard';
import type { Recommendation, RecommendationOpenOptions } from '~/types/recommendation/recommendation';
import type { CollectionRexEntry } from '~/api/CollectionsApi';
import AddToCollectionSheet, { RecSummary } from '~/components/faves/AddToCollectionSheet';

function entryToRec(entry: CollectionRexEntry): Recommendation {
  return {
    id: entry.rex_id,
    title: entry.place_name,
    categoryId: entry.category_code,
    category: entry.category_name ?? entry.category_code,
    photoPath: entry.photo_path,
    location: entry.location ?? undefined,
    rating: entry.rating ?? undefined,
    scoreValueForMoney: entry.score_value_for_money ?? undefined,
    user: (entry.recommender_name || entry.recommender_handle)
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
  const { uri: coverUri } = useSignedStorageUrl(REX_IMAGES_BUCKET, detail?.cover_image_path ?? '');
  const [coverBg, setCoverBg] = useState('#1a1a1a');
  const [saveTarget, setSaveTarget] = useState<RecSummary | null>(null);

  useEffect(() => {
    if (!coverUri) return;
    ImageColors.getColors(coverUri, { fallback: '#1a1a1a', cache: true, key: coverUri })
      .then((colors) => {
        const color =
          colors.platform === 'ios'
            ? colors.primary
            : colors.platform === 'android'
              ? colors.dominant
              : colors.platform === 'web'
                ? colors.dominant
                : '#1a1a1a';
        setCoverBg(color ?? '#1a1a1a');
      })
      .catch(() => {});
  }, [coverUri]);

  const removeMutation = useRemoveRexFromCollection(collectionId);
  const deleteMutation = useDeleteCollection();
  const { mutate: save } = useSaveCollection();
  const { mutate: unsave } = useUnsaveCollection();

  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const isSaved = savedOverride ?? detail?.is_saved ?? false;

  const handleCopyLink = async () => {
    setShowMenu(false);
    const base =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://trurex.netlify.app';
    await Clipboard.setStringAsync(`${base}/collection/${collectionId}`);
    toastSuccess('Link copied!');
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
    <View style={webContainerStyle} className="px-4">
      <View className="flex-row items-center justify-between py-4">
        <TouchableOpacity onPress={onBack} className="flex-row items-center gap-1">
          <ArrowLeft size={16} color={Theme.colors.muted} />
          <Text className="text-sm text-muted-foreground">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          ref={menuButtonRef as any}
          onPress={() => {
            menuButtonRef.current?.measure((_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
              setMenuPos({ top: pageY + height + 4, right: screenWidth - pageX - width });
            });
            setShowMenu((v) => !v);
          }}
          className="p-2"
        >
          <MoreVertical size={18} color={Theme.colors.muted} />
        </TouchableOpacity>
      </View>

      {coverUri && (
        <View style={{ width: '100%', height: 220, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: coverBg, opacity: 0.15 }} />
          <Image source={{ uri: coverUri }} style={{ width: '100%', height: '100%' }} contentFit="contain" />
        </View>
      )}

      <Text className="text-xl font-bold text-foreground">{detail.display_name}</Text>
      {detail.description && (
        <Text className="text-sm text-muted-foreground mt-1">{detail.description}</Text>
      )}

      {detail.is_my_collection ? (
        <TouchableOpacity
          onPress={() => onAddItem(collectionId)}
          className="w-full flex-row items-center justify-center gap-2 py-3 my-4 rounded-xl border-2 border-dashed border-border"
        >
          <Plus size={16} color={Theme.colors.muted} />
          <Text className="text-sm font-medium text-muted-foreground">Add to Collection</Text>
        </TouchableOpacity>
      ) : (
        <View className="h-px bg-border my-4" />
      )}
    </View>
  );

  return (
    <>
      <FlatList
        data={detail.rexes}
        keyExtractor={(item) => item.rex_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="pb-24"
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View className="items-center py-10 gap-2 px-4">
            <Text className="text-sm text-muted-foreground text-center">No rexes in this collection yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            className="px-4"
            style={isWeb ? { maxWidth: 680, width: '100%', alignSelf: 'center' } : undefined}
          >
            <RecommendationCard
              recommendation={entryToRec(item)}
              onTap={onRecommendationPress}
              onRemove={detail.is_my_collection ? () => removeMutation.mutate(item.rex_id) : undefined}
              onSave={() =>
                setSaveTarget({
                  id: item.rex_id,
                  place_name: item.place_name,
                  category_code: item.category_code,
                  location: item.location ?? undefined,
                  isSaved: true,
                })
              }
            />
          </View>
        )}
      />

      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowMenu(false)} />
        <View
          style={{ position: 'absolute', top: menuPos.top, right: menuPos.right, minWidth: 200 }}
          className="bg-card border border-border rounded-xl shadow-lg p-2"
        >
          {detail.is_my_collection ? (
            <>
              <TouchableOpacity
                onPress={() => { setShowEdit(true); setShowMenu(false); }}
                className="flex-row items-center gap-3 px-4 py-2.5"
              >
                <Pencil size={15} color={Theme.colors.foreground} />
                <Text className="text-sm text-foreground">Edit collection</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCopyLink}
                className="flex-row items-center gap-3 px-4 py-2.5"
              >
                <Link size={15} color={Theme.colors.foreground} />
                <Text className="text-sm text-foreground">Copy link</Text>
              </TouchableOpacity>
              <View className="h-px bg-border mx-2 my-1" />
              <TouchableOpacity
                onPress={() => { setShowDeleteConfirm(true); setShowMenu(false); }}
                className="flex-row items-center gap-3 px-4 py-2.5"
              >
                <Trash2 size={15} color={Theme.colors.destructive} />
                <Text className="text-sm text-destructive">Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleCopyLink}
                className="flex-row items-center gap-3 px-4 py-2.5"
              >
                <Link size={15} color={Theme.colors.foreground} />
                <Text className="text-sm text-foreground">Copy link</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowMenu(false);
                  const next = !isSaved;
                  setSavedOverride(next);
                  if (next) {
                    save(collectionId, { onError: () => setSavedOverride(!next) });
                  } else {
                    unsave(collectionId, { onError: () => setSavedOverride(!next) });
                  }
                }}
                className="flex-row items-center gap-3 px-4 py-2.5"
              >
                {isSaved
                  ? <BookmarkMinus size={15} color={Theme.colors.destructive} />
                  : <BookmarkPlus size={15} color={Theme.colors.foreground} />
                }
                <Text className={`text-sm ${isSaved ? 'text-destructive' : 'text-foreground'}`}>
                  {isSaved ? 'Remove from saved' : 'Save to my collections'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
        }}
      />

      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType={isWeb ? 'fade' : 'slide'}
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <Pressable
          className={`flex-1 bg-black/50 ${isWeb ? 'items-center justify-center px-4' : 'justify-end'}`}
          onPress={() => setShowDeleteConfirm(false)}
        >
          <Pressable
            className={`bg-card border border-border pt-3 pb-8 ${isWeb ? 'rounded-2xl w-full' : 'rounded-t-2xl border-t-0'}`}
            style={isWeb ? { maxWidth: 400 } : undefined}
            onPress={() => {}}
          >
            <View style={webContainerStyle} className="px-4">
              <View className="items-center mb-4">
                <View className={`w-10 h-1 rounded-full bg-muted-foreground/30 ${isWeb ? 'hidden' : ''}`} />
              </View>
              <View className="w-12 h-12 rounded-full bg-destructive/10 items-center justify-center mb-4 self-center">
                <Trash2 size={22} color={Theme.colors.destructive} />
              </View>
              <Text className="text-lg font-display font-bold text-foreground text-center mb-1">
                Delete collection?
              </Text>
              <Text className="text-sm text-muted-foreground text-center mb-6">
                "{detail.display_name}" will be permanently deleted. This cannot be undone.
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowDeleteConfirm(false)}
                  activeOpacity={0.7}
                  className="flex-1 py-2.5 rounded-xl bg-muted items-center"
                >
                  <Text className="text-sm font-semibold text-foreground">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteMutation.mutate(collectionId, { onSuccess: onBack })}
                  activeOpacity={0.8}
                  className="flex-1 py-2.5 rounded-xl bg-destructive items-center"
                >
                  <Text className="text-sm font-semibold text-white">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <AddToCollectionSheet
        open={!!saveTarget}
        rec={saveTarget}
        onClose={() => setSaveTarget(null)}
      />
    </>
  );
};

export default CollectionDetailView;
