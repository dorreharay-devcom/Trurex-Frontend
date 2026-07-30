import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Plus, PackageOpen, MapPin, X, Calendar, Link2 } from 'lucide-react-native';
import { CollectionsApi } from '~/api/CollectionsApi';
import { RexCoverThumbnail } from '~/components/common/RexCoverThumbnail';
import { useQueryClient } from '@tanstack/react-query';
import { useMyCollections, useMySavedCollections } from '~/hooks/useCollections';
import { useSavedRexes } from '~/hooks/useGems';
import { useAuth } from '~/features/auth/providers';
import { webContainerStyle, singleLineEllipsisTextStyle } from '~/utils';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import type {
  Recommendation,
  RecommendationOpenOptions,
} from '~/types/recommendation/recommendation';
import CollectionDetailView from '~/components/faves/CollectionDetailView';
import CreateCollectionModal from '~/components/faves/CreateCollectionModal';
import AddToCollectionSheet, { RecSummary } from '~/components/faves/AddToCollectionSheet';
import AddRexToCollectionSheet from '~/components/faves/AddRexToCollectionSheet';
import CollectionCard from '~/components/profile/CollectionCard';
import { ConnectionLoadMoreButton } from '~/components/circles/common';
import { DestructiveActionConfirmModal } from '~/components/common/DestructiveActionConfirmModal';
import { toastError } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { unknownErrorMessage } from '~/utils';
import { ClearableSearchInput } from '~/components/common/ClearableSearchInput';

type FavesViewProps = {
  commentCountByRexId?: Record<string, number>;
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
};

const FavesView: React.FC<FavesViewProps> = ({ onRecommendationPress }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState('');
  const [openCollectionId, setOpenCollectionId] = useState<string | null>(null);
  const [addToCollectionId, setAddToCollectionId] = useState<string | null>(null);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [addToCollectionRec, setAddToCollectionRec] = useState<RecSummary | null>(null);
  const [confirmRemoveUncollected, setConfirmRemoveUncollected] = useState<Recommendation | null>(
    null,
  );
  const [removeUncollectedPending, setRemoveUncollectedPending] = useState(false);

  const {
    data: myCollections = [],
    isLoading: loadingMine,
    hasNextPage: hasNextCollectionsPage,
    isFetchingNextPage: isFetchingNextCollectionsPage,
    fetchNextPage: fetchNextCollectionsPage,
  } = useMyCollections(user?.id);
  const { data: savedCollections = [], isLoading: loadingSavedCollections } =
    useMySavedCollections();
  const collections = useMemo(
    () => [...myCollections, ...savedCollections],
    [myCollections, savedCollections],
  );
  const loadingCollections = loadingMine || loadingSavedCollections;
  const {
    data: savedRexes = [],
    isLoading: loadingSaved,
    hasNextPage: hasNextSavedRexesPage,
    isFetchingNextPage: isFetchingNextSavedRexesPage,
    fetchNextPage: fetchNextSavedRexesPage,
  } = useSavedRexes({
    uncollected: true,
    search_term: searchQuery.trim() || null,
  });
  const uncollectedRecs = savedRexes;

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections;
    const q = searchQuery.toLowerCase();
    return collections.filter((c) => c.display_name.toLowerCase().includes(q));
  }, [collections, searchQuery]);

  const filteredUncollected = uncollectedRecs;

  const confirmRemoveUncollectedRex = async () => {
    if (!user || !confirmRemoveUncollected) return;
    setRemoveUncollectedPending(true);
    try {
      await CollectionsApi.unsaveRex(user.id, confirmRemoveUncollected.id);
      queryClient.invalidateQueries({ queryKey: ['my-saved-ids'] });
      queryClient.invalidateQueries({ queryKey: ['my-saved-rexes'] });
      queryClient.invalidateQueries({ queryKey: ['discover-recommendations'] });
      setConfirmRemoveUncollected(null);
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not remove', unknownErrorMessage(e, 'Try again.'));
    } finally {
      setRemoveUncollectedPending(false);
    }
  };

  if (openCollectionId) {
    return (
      <>
        <CollectionDetailView
          collectionId={openCollectionId}
          onBack={() => {
            setOpenCollectionId(null);
            queryClient.invalidateQueries({ queryKey: ['my-collections'] });
            queryClient.invalidateQueries({ queryKey: ['my-saved-collections'] });
            queryClient.invalidateQueries({ queryKey: ['my-saved-rexes'] });
          }}
          onAddItem={(id) => setAddToCollectionId(id)}
          onRecommendationPress={onRecommendationPress}
        />
        <AddRexToCollectionSheet
          open={!!addToCollectionId}
          collectionId={addToCollectionId}
          onClose={() => setAddToCollectionId(null)}
        />
      </>
    );
  }

  const ListHeader = (
    <View className="px-4 pt-6">
      <ClearableSearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search your saved gems..."
        placeholderTextColor={Theme.colors.muted}
        containerClassName="mb-4"
        iconColor={Theme.colors.muted}
        clearIconColor={Theme.colors.muted}
        inputClassName="w-full pl-9 pr-10 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground"
        inputStyle={[
          textFieldCaretStyle,
          textFieldSingleLineStyle,
          textFieldSingleLineDefaultHeightStyle,
        ]}
        multiline={false}
        numberOfLines={1}
        scrollEnabled={false}
      />

      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-lg font-display font-bold text-foreground">Gems</Text>
        <TouchableOpacity
          onPress={() => setShowCreateCollection(true)}
          activeOpacity={0.7}
          className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg border border-border"
        >
          <Plus size={14} color={Theme.colors.foreground} />
          <Text className="text-xs font-medium text-foreground">New collection</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-xs text-muted-foreground mb-5">
        Showing {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''}
      </Text>

      {loadingCollections ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <View className="flex-row gap-3">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={{ width: 160, height: 204, borderRadius: 12 }}
                className="bg-border/40"
              />
            ))}
          </View>
        </ScrollView>
      ) : filteredCollections.length > 0 ? (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 pb-1"
          >
            {filteredCollections.map((col) => (
              <CollectionCard
                key={col.id}
                collection={col}
                onPress={() => setOpenCollectionId(col.id)}
              />
            ))}
          </ScrollView>
          <View className="mb-6">
            <ConnectionLoadMoreButton
              visible={hasNextCollectionsPage}
              loading={isFetchingNextCollectionsPage}
              onPress={fetchNextCollectionsPage}
            />
          </View>
        </>
      ) : (
        <View className="items-center mb-6 py-6 px-4 rounded-2xl border border-dashed border-border bg-muted/30">
          <View className="flex-row mb-5">
            {[
              { emoji: '🍜', bg: 'bg-purple-500' },
              { emoji: '🏕️', bg: 'bg-sky-500' },
              { emoji: '📚', bg: 'bg-primary' },
            ].map((item, idx) => (
              <View
                key={idx}
                className={`w-12 h-16 rounded-xl ${item.bg} items-center justify-center`}
                style={{
                  marginLeft: idx === 0 ? 0 : -8,
                  zIndex: idx,
                  transform: [{ rotate: `${(idx - 1) * 6}deg` }],
                }}
              >
                <Text className="text-2xl">{item.emoji}</Text>
              </View>
            ))}
          </View>
          <Text className="text-base font-display font-bold text-foreground mb-1">
            No collections yet
          </Text>
          <Text className="text-sm text-muted-foreground text-center mb-4">
            Group your saved Rex into collections — by vibe, city, or whoever you'd share them with.
          </Text>
          <View className="flex-row flex-wrap justify-center gap-2 mb-5">
            {['Best eats in Tokyo 🍜', 'Weekend escapes 🏕️', 'Hidden bars 🍸'].map((label) => (
              <TouchableOpacity
                key={label}
                activeOpacity={0.7}
                onPress={() => setShowCreateCollection(true)}
                className="px-3 py-1.5 rounded-full border border-border bg-card"
              >
                <Text className="text-xs text-foreground">{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => setShowCreateCollection(true)}
            activeOpacity={0.8}
            className="flex-row items-center gap-2 px-5 py-2.5 rounded-xl bg-primary"
          >
            <Plus size={16} color={Theme.colors.primaryForeground} />
            <Text className="text-sm font-semibold text-primary-foreground">
              Create first collection
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text className="text-base font-display font-medium text-foreground mb-1">
        Uncollected Rex
      </Text>
      <Text className="text-xs text-muted-foreground mb-4">
        Rex you've saved but haven't added to a collection yet
      </Text>

      {loadingSaved && (
        <View className="gap-3 mb-3">
          {[1, 2].map((i) => (
            <View key={i} className="h-16 rounded-xl bg-border/40" />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <>
      <FlatList
        data={loadingSaved ? [] : filteredUncollected}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="pb-24"
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <View className="px-4 mb-3">
            <TouchableOpacity
              activeOpacity={onRecommendationPress ? 0.7 : 1}
              onPress={() => onRecommendationPress?.(item)}
              disabled={!onRecommendationPress}
              className="min-w-0 flex-row items-center gap-3 p-3 rounded-xl bg-card border border-border"
            >
              <RexCoverThumbnail rec={item} className="h-12 w-12 rounded-lg flex-shrink-0" />
              <View className="min-w-0 flex-1 overflow-hidden">
                <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                  {item.title}
                </Text>
                <View className="mt-1 items-start">
                  <View className="rounded-full border border-[#d4d4d4cc] bg-[#d4d4d466] px-2 py-0.5">
                    <Text className="text-[10px] font-medium capitalize text-foreground">
                      {item.category}
                    </Text>
                  </View>
                </View>
                {item.isOnlinePlace && item.placeWebsiteUrl ? (
                  <View className="mt-1 min-w-0 flex-row items-center gap-0.5 overflow-hidden">
                    <Link2 size={10} color={Theme.colors.muted} style={{ flexShrink: 0 }} />
                    <Text
                      className="text-[11px] text-muted-foreground"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={singleLineEllipsisTextStyle}
                    >
                      {item.placeWebsiteUrl}
                    </Text>
                  </View>
                ) : null}
                {item.location ? (
                  <View className="mt-1 min-w-0 flex-row items-center gap-0.5 overflow-hidden">
                    <MapPin size={10} color={Theme.colors.muted} style={{ flexShrink: 0 }} />
                    <Text
                      className="text-[11px] text-muted-foreground"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={singleLineEllipsisTextStyle}
                    >
                      {item.location}
                    </Text>
                  </View>
                ) : null}
                {item.description ? (
                  <Text className="text-xs text-foreground/70 mt-1" numberOfLines={1}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
              <View className="flex-col items-end gap-1.5 flex-shrink-0">
                {item.savedAt ? (
                  <View className="flex-row items-center gap-0.5">
                    <Calendar size={10} color={Theme.colors.muted} />
                    <Text className="text-[10px] text-muted-foreground">
                      {new Date(item.savedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                ) : null}
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() =>
                      setAddToCollectionRec({
                        id: item.id,
                        place_name: item.title,
                        category_code: item.categoryId,
                        location: item.location,
                        isSaved: item.isSaved,
                      })
                    }
                    activeOpacity={0.7}
                    className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border"
                  >
                    <Plus size={10} color={Theme.colors.foreground} />
                    <Text className="text-[11px] font-medium text-foreground">Add</Text>
                  </TouchableOpacity>
                  <Pressable
                    onPress={() => user && setConfirmRemoveUncollected(item)}
                    className="p-0.5"
                  >
                    {({ hovered, pressed }: { hovered?: boolean; pressed?: boolean }) => (
                      <View
                        className={`w-6 h-6 rounded-full items-center justify-center ${hovered || pressed ? 'bg-destructive/10' : ''}`}
                      >
                        <X
                          size={12}
                          color={hovered || pressed ? Theme.colors.destructive : Theme.colors.muted}
                        />
                      </View>
                    )}
                  </Pressable>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          loadingSaved ? null : (
            <View className="items-center py-10 gap-2">
              <PackageOpen size={28} color={Theme.colors.muted} />
              <Text className="text-sm text-muted-foreground">
                {searchQuery.trim() ? 'No matches' : 'All your Rex are in collections. Nice work.'}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          <View className="px-4">
            <ConnectionLoadMoreButton
              visible={!loadingSaved && hasNextSavedRexesPage}
              loading={isFetchingNextSavedRexesPage}
              onPress={fetchNextSavedRexesPage}
            />
          </View>
        }
      />

      <DestructiveActionConfirmModal
        visible={confirmRemoveUncollected != null}
        title="Remove from saved?"
        message={
          confirmRemoveUncollected
            ? `"${confirmRemoveUncollected.title}" will be removed from Uncollected Rex. You can save it again from Discover.`
            : ''
        }
        confirmLabel="Remove"
        pending={removeUncollectedPending}
        onCancel={() => !removeUncollectedPending && setConfirmRemoveUncollected(null)}
        onConfirm={() => void confirmRemoveUncollectedRex()}
      />

      <CreateCollectionModal
        open={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
        onCreated={(id) => {
          setShowCreateCollection(false);
          queryClient.invalidateQueries({ queryKey: ['my-collections'] });
          setOpenCollectionId(id);
        }}
      />

      <AddToCollectionSheet
        open={!!addToCollectionRec}
        rec={addToCollectionRec}
        onClose={() => {
          setAddToCollectionRec(null);
          queryClient.invalidateQueries({ queryKey: ['my-collections'] });
        }}
      />
    </>
  );
};

export default FavesView;
